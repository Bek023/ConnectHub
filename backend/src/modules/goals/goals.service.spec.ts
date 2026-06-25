import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './entities/goal.entity';
import { UserGoal } from './entities/user-goal.entity';
import { SearchService } from '@/modules/search/search.service';

const mockGoal = (): Goal =>
  ({
    id: 'goal-uuid-1',
    title: 'Learn Coding',
    description: 'Learn to code from scratch',
    category: 'education',
    memberCount: 5,
  }) as Goal;

const mockUserGoal = (): UserGoal =>
  ({
    id: 'user-goal-uuid-1',
    goalId: 'goal-uuid-1',
    userId: 'user-uuid-1',
  }) as UserGoal;

describe('GoalsService', () => {
  let service: GoalsService;
  let goalRepo: any;
  let userGoalRepo: any;
  let searchService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: getRepositoryToken(Goal),
          useValue: {
            findAndCount: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            increment: jest.fn(),
            decrement: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserGoal),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
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

    service = module.get(GoalsService);
    goalRepo = module.get(getRepositoryToken(Goal));
    userGoalRepo = module.get(getRepositoryToken(UserGoal));
    searchService = module.get(SearchService);
  });

  describe('findAll', () => {
    it('paginates goals with optional category/query filters', async () => {
      const goal = mockGoal();
      goalRepo.findAndCount.mockResolvedValue([[goal], 1]);

      const result = await service.findAll(1, 20, 'education', 'coding');

      expect(goalRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ category: 'education' }) }),
      );
      expect(result).toEqual({ items: [goal], total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });

  describe('trending', () => {
    it('returns goals ordered by memberCount', async () => {
      const goal = mockGoal();
      goalRepo.find.mockResolvedValue([goal]);

      const result = await service.trending(10);

      expect(goalRepo.find).toHaveBeenCalledWith({ order: { memberCount: 'DESC' }, take: 10 });
      expect(result).toEqual([goal]);
    });
  });

  describe('myGoals', () => {
    it('returns the goals a user has joined', async () => {
      const goal = mockGoal();
      userGoalRepo.find.mockResolvedValue([{ ...mockUserGoal(), goal }]);

      const result = await service.myGoals('user-uuid-1');

      expect(userGoalRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1' },
        relations: ['goal'],
      });
      expect(result).toEqual([goal]);
    });
  });

  describe('findOne', () => {
    it('returns the goal when found', async () => {
      const goal = mockGoal();
      goalRepo.findOne.mockResolvedValue(goal);
      await expect(service.findOne(goal.id)).resolves.toEqual(goal);
    });

    it('throws NotFoundException when not found', async () => {
      goalRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates the goal and indexes it for search', async () => {
      const goal = mockGoal();
      goalRepo.create.mockReturnValue(goal);
      goalRepo.save.mockResolvedValue(goal);

      const result = await service.create({ title: goal.title, category: goal.category } as any);

      expect(goalRepo.save).toHaveBeenCalledWith(goal);
      expect(searchService.indexDocument).toHaveBeenCalledWith(
        'goals',
        goal.id,
        expect.objectContaining({ title: goal.title }),
      );
      expect(result).toEqual(goal);
    });
  });

  describe('update', () => {
    it('updates the goal and re-indexes it', async () => {
      const goal = mockGoal();
      const updated = { ...goal, title: 'Updated title' } as Goal;
      goalRepo.findOne.mockResolvedValueOnce(goal).mockResolvedValueOnce(updated);
      goalRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(goal.id, { title: 'Updated title' });

      expect(goalRepo.update).toHaveBeenCalledWith(goal.id, { title: 'Updated title' });
      expect(searchService.indexDocument).toHaveBeenCalledWith(
        'goals',
        goal.id,
        expect.objectContaining({ title: 'Updated title' }),
      );
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deletes the goal and removes it from the index', async () => {
      const goal = mockGoal();
      goalRepo.findOne.mockResolvedValue(goal);
      goalRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(goal.id);

      expect(goalRepo.delete).toHaveBeenCalledWith(goal.id);
      expect(searchService.deleteDocument).toHaveBeenCalledWith('goals', goal.id);
      expect(result).toEqual({ message: "Maqsad o'chirildi" });
    });
  });

  describe('join', () => {
    it('creates a membership and increments memberCount when not already joined', async () => {
      const goal = mockGoal();
      const userGoal = mockUserGoal();
      goalRepo.findOne.mockResolvedValue(goal);
      userGoalRepo.findOne.mockResolvedValue(null);
      userGoalRepo.create.mockReturnValue(userGoal);
      userGoalRepo.save.mockResolvedValue(userGoal);

      const result = await service.join(goal.id, 'user-uuid-1');

      expect(userGoalRepo.save).toHaveBeenCalledWith(userGoal);
      expect(goalRepo.increment).toHaveBeenCalledWith({ id: goal.id }, 'memberCount', 1);
      expect(result).toEqual(userGoal);
    });

    it('returns the existing membership without incrementing when already joined', async () => {
      const goal = mockGoal();
      const userGoal = mockUserGoal();
      goalRepo.findOne.mockResolvedValue(goal);
      userGoalRepo.findOne.mockResolvedValue(userGoal);

      const result = await service.join(goal.id, 'user-uuid-1');

      expect(userGoalRepo.save).not.toHaveBeenCalled();
      expect(goalRepo.increment).not.toHaveBeenCalled();
      expect(result).toEqual(userGoal);
    });
  });

  describe('leave', () => {
    it('deletes the membership and decrements memberCount', async () => {
      const goal = mockGoal();
      userGoalRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.leave(goal.id, 'user-uuid-1');

      expect(userGoalRepo.delete).toHaveBeenCalledWith({ goalId: goal.id, userId: 'user-uuid-1' });
      expect(goalRepo.decrement).toHaveBeenCalledWith({ id: goal.id }, 'memberCount', 1);
      expect(result).toEqual({ message: 'Maqsaddan chiqdingiz' });
    });
  });
});
