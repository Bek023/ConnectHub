import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { GroupMember, MemberRole } from './entities/group-member.entity';

const mockGroup = (): Group =>
  ({
    id: 'group-uuid-1',
    name: 'Test Group',
    goalId: 'goal-uuid-1',
    createdById: 'user-uuid-1',
    memberCount: 1,
    maxMembers: 1000,
    isPrivate: false,
    inviteCode: 'abc12345',
  }) as Group;

const mockMember = (role = MemberRole.MEMBER): GroupMember =>
  ({
    id: 'member-uuid-1',
    groupId: 'group-uuid-1',
    userId: 'user-uuid-1',
    role,
  }) as GroupMember;

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepo: any;
  let memberRepo: any;
  let dataSource: any;
  let mockManager: any;

  beforeEach(async () => {
    mockManager = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GroupMember),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn((cb) => cb(mockManager)),
          },
        },
      ],
    }).compile();

    service = module.get(GroupsService);
    groupRepo = module.get(getRepositoryToken(Group));
    memberRepo = module.get(getRepositoryToken(GroupMember));
    dataSource = module.get(DataSource);
  });

  describe('findOne', () => {
    it('returns group when found', async () => {
      const group = mockGroup();
      groupRepo.findOne.mockResolvedValue(group);
      const result = await service.findOne(group.id);
      expect(result).toEqual(group);
    });

    it('throws NotFoundException when group does not exist', async () => {
      groupRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates group and admin member within a transaction', async () => {
      const group = mockGroup();
      const member = mockMember(MemberRole.ADMIN);
      mockManager.create.mockReturnValueOnce(group).mockReturnValueOnce(member);
      mockManager.save.mockResolvedValueOnce(group).mockResolvedValueOnce(member);

      const result = await service.create({ name: 'Test Group', goalId: 'goal-uuid-1' } as any, 'user-uuid-1');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(group);
    });
  });

  describe('join', () => {
    it('throws ConflictException when user is already a member', async () => {
      groupRepo.findOne.mockResolvedValue(mockGroup());
      memberRepo.findOne.mockResolvedValue(mockMember());

      await expect(service.join('group-uuid-1', 'user-uuid-1')).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException when group is full', async () => {
      const fullGroup = { ...mockGroup(), memberCount: 1000, maxMembers: 1000 } as Group;
      groupRepo.findOne.mockResolvedValue(fullGroup);
      memberRepo.findOne.mockResolvedValue(null);

      await expect(service.join('group-uuid-1', 'user-uuid-2')).rejects.toThrow(ConflictException);
    });

    it('creates member and increments memberCount inside transaction', async () => {
      const group = mockGroup();
      const member = mockMember();
      groupRepo.findOne.mockResolvedValue(group);
      memberRepo.findOne.mockResolvedValue(null);
      mockManager.create.mockReturnValue(member);
      mockManager.save.mockResolvedValue(member);

      const result = await service.join('group-uuid-1', 'user-uuid-2');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledWith(member);
      expect(mockManager.increment).toHaveBeenCalledWith(Group, { id: 'group-uuid-1' }, 'memberCount', 1);
      expect(result).toEqual(member);
    });
  });

  describe('leave', () => {
    it('deletes member and decrements memberCount inside transaction when member exists', async () => {
      mockManager.delete.mockResolvedValue({ affected: 1 });

      await service.leave('group-uuid-1', 'user-uuid-1');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.delete).toHaveBeenCalledWith(GroupMember, { groupId: 'group-uuid-1', userId: 'user-uuid-1' });
      expect(mockManager.decrement).toHaveBeenCalledWith(Group, { id: 'group-uuid-1' }, 'memberCount', 1);
    });

    it('skips decrement when member does not exist', async () => {
      mockManager.delete.mockResolvedValue({ affected: 0 });

      await service.leave('group-uuid-1', 'non-member');

      expect(mockManager.decrement).not.toHaveBeenCalled();
    });
  });

  describe('updateMemberRole', () => {
    it('throws ForbiddenException when actor is not admin', async () => {
      memberRepo.findOne.mockResolvedValue(mockMember(MemberRole.MEMBER));

      await expect(
        service.updateMemberRole('group-uuid-1', 'user-uuid-2', MemberRole.MODERATOR, 'user-uuid-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('updates role when actor is admin', async () => {
      const admin = mockMember(MemberRole.ADMIN);
      const updated = { ...mockMember(), role: MemberRole.MODERATOR } as GroupMember;
      memberRepo.findOne.mockResolvedValueOnce(admin).mockResolvedValueOnce(updated);
      memberRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateMemberRole('group-uuid-1', 'user-uuid-2', MemberRole.MODERATOR, 'user-uuid-1');

      expect(memberRepo.update).toHaveBeenCalledWith(
        { groupId: 'group-uuid-1', userId: 'user-uuid-2' },
        { role: MemberRole.MODERATOR },
      );
      expect(result?.role).toBe(MemberRole.MODERATOR);
    });
  });
});
