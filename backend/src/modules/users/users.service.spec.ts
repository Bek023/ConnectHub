import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

const mockUser = (): User =>
  ({
    id: 'user-uuid-1',
    username: 'john_doe',
    email: 'john@example.com',
    displayName: 'John Doe',
    isActive: true,
    isVerified: true,
  }) as User;

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      const user = mockUser();
      repo.findOne.mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(result).toEqual(user);
    });

    it('returns null when not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('returns user by email', async () => {
      const user = mockUser();
      repo.findOne.mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(result).toEqual(user);
    });
  });

  describe('updateMe', () => {
    it('updates and returns user', async () => {
      const user = mockUser();
      const updated = { ...user, displayName: 'Updated Name' } as User;
      repo.findOne.mockResolvedValue(user);
      repo.save.mockResolvedValue(updated);

      const result = await service.updateMe(user.id, { displayName: 'Updated Name' });

      expect(repo.save).toHaveBeenCalled();
      expect(result.displayName).toBe('Updated Name');
    });

    it('throws NotFoundException when user does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.updateMe('non-existent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMe', () => {
    it('soft-deletes user by setting isActive to false', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const result = await service.deleteMe('user-uuid-1');
      expect(repo.update).toHaveBeenCalledWith('user-uuid-1', { isActive: false });
      expect(result).toHaveProperty('message');
    });
  });

  describe('search', () => {
    it('returns paginated results', async () => {
      const users = [mockUser()];
      repo.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.search('john', 1, 20);

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });
  });
});
