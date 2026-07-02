import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { GroupMember, MemberRole } from './entities/group-member.entity';
import { SearchService } from '@/modules/search/search.service';

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
  let searchService: any;

  beforeEach(async () => {
    mockManager = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
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
        {
          provide: SearchService,
          useValue: {
            indexDocument: jest.fn(),
            deleteDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(GroupsService);
    groupRepo = module.get(getRepositoryToken(Group));
    memberRepo = module.get(getRepositoryToken(GroupMember));
    dataSource = module.get(DataSource);
    searchService = module.get(SearchService);
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

      const result = await service.create(
        { name: 'Test Group', goalId: 'goal-uuid-1' } as any,
        'user-uuid-1',
      );

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(searchService.indexDocument).toHaveBeenCalledWith(
        'groups',
        group.id,
        expect.objectContaining({ name: group.name }),
      );
      expect(result).toEqual(group);
    });
  });

  describe('join', () => {
    it('throws ConflictException when user is already a member', async () => {
      groupRepo.findOne.mockResolvedValue(mockGroup());
      mockManager.findOne.mockResolvedValueOnce(mockGroup()).mockResolvedValueOnce(mockMember());

      await expect(service.join('group-uuid-1', 'user-uuid-1')).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException when group is full', async () => {
      const fullGroup = { ...mockGroup(), memberCount: 1000, maxMembers: 1000 } as Group;
      groupRepo.findOne.mockResolvedValue(fullGroup);
      mockManager.findOne.mockResolvedValueOnce(fullGroup).mockResolvedValueOnce(null);

      await expect(service.join('group-uuid-1', 'user-uuid-2')).rejects.toThrow(ConflictException);
    });

    it('creates member and increments memberCount inside transaction', async () => {
      const group = mockGroup();
      const member = mockMember();
      groupRepo.findOne.mockResolvedValue(group);
      mockManager.findOne.mockResolvedValueOnce(group).mockResolvedValueOnce(null);
      mockManager.create.mockReturnValue(member);
      mockManager.save.mockResolvedValue(member);

      const result = await service.join('group-uuid-1', 'user-uuid-2');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledWith(member);
      expect(mockManager.increment).toHaveBeenCalledWith(
        Group,
        { id: 'group-uuid-1' },
        'memberCount',
        1,
      );
      expect(result).toEqual(member);
    });
  });

  describe('leave', () => {
    it('deletes member and decrements memberCount inside transaction when member exists', async () => {
      mockManager.findOne.mockResolvedValue(mockMember());
      mockManager.delete.mockResolvedValue({ affected: 1 });

      await service.leave('group-uuid-1', 'user-uuid-1');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.delete).toHaveBeenCalledWith(GroupMember, {
        groupId: 'group-uuid-1',
        userId: 'user-uuid-1',
      });
      expect(mockManager.decrement).toHaveBeenCalledWith(
        Group,
        { id: 'group-uuid-1' },
        'memberCount',
        1,
      );
    });

    it('skips decrement when member does not exist', async () => {
      mockManager.findOne.mockResolvedValue(null);

      await service.leave('group-uuid-1', 'non-member');

      expect(mockManager.delete).not.toHaveBeenCalled();
      expect(mockManager.decrement).not.toHaveBeenCalled();
    });

    it('blocks the only admin from leaving while other members remain', async () => {
      mockManager.findOne.mockResolvedValue(mockMember(MemberRole.ADMIN));
      mockManager.count.mockResolvedValueOnce(1).mockResolvedValueOnce(5);

      await expect(service.leave('group-uuid-1', 'user-uuid-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deletes the group when the last member leaves', async () => {
      mockManager.findOne.mockResolvedValue(mockMember(MemberRole.ADMIN));
      mockManager.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1);
      mockManager.delete.mockResolvedValue({ affected: 1 });

      await service.leave('group-uuid-1', 'user-uuid-1');

      expect(mockManager.delete).toHaveBeenCalledWith(Group, { id: 'group-uuid-1' });
      expect(searchService.deleteDocument).toHaveBeenCalledWith('groups', 'group-uuid-1');
    });
  });

  describe('updateMemberRole', () => {
    it('throws ForbiddenException when actor is not admin', async () => {
      memberRepo.findOne.mockResolvedValue(mockMember(MemberRole.MEMBER));

      await expect(
        service.updateMemberRole(
          'group-uuid-1',
          'user-uuid-2',
          MemberRole.MODERATOR,
          'user-uuid-1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('updates role when actor is admin', async () => {
      const admin = mockMember(MemberRole.ADMIN);
      const updated = { ...mockMember(), role: MemberRole.MODERATOR } as GroupMember;
      memberRepo.findOne.mockResolvedValueOnce(admin).mockResolvedValueOnce(updated);
      memberRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateMemberRole(
        'group-uuid-1',
        'user-uuid-2',
        MemberRole.MODERATOR,
        'user-uuid-1',
      );

      expect(memberRepo.update).toHaveBeenCalledWith(
        { groupId: 'group-uuid-1', userId: 'user-uuid-2' },
        { role: MemberRole.MODERATOR },
      );
      expect(result?.role).toBe(MemberRole.MODERATOR);
    });
  });
});
