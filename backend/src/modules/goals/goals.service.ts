import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { UserGoal } from './entities/user-goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { SearchService } from '@/modules/search/search.service';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepo: Repository<Goal>,
    @InjectRepository(UserGoal) private userGoalRepo: Repository<UserGoal>,
    private searchService: SearchService,
  ) {}

  async findAll(page = 1, limit = 20, category?: string, q?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (q) where.title = Like(`%${q}%`);
    const [items, total] = await this.goalRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async trending(limit = 10) {
    return this.goalRepo.find({ order: { memberCount: 'DESC' }, take: limit });
  }

  async myGoals(userId: string) {
    const userGoals = await this.userGoalRepo.find({ where: { userId }, relations: ['goal'] });
    return userGoals.map((ug) => ug.goal);
  }

  async findOne(id: string) {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Maqsad topilmadi');
    return goal;
  }

  async create(dto: CreateGoalDto) {
    const goal = this.goalRepo.create(dto);
    await this.goalRepo.save(goal);
    await this.searchService.indexDocument('goals', goal.id, {
      title: goal.title,
      description: goal.description,
      category: goal.category,
      memberCount: goal.memberCount,
      createdAt: goal.createdAt,
    });
    return goal;
  }

  async update(id: string, dto: UpdateGoalDto) {
    await this.findOne(id);
    await this.goalRepo.update(id, dto);
    const updated = await this.findOne(id);
    await this.searchService.indexDocument('goals', id, {
      title: updated.title,
      description: updated.description,
      category: updated.category,
      memberCount: updated.memberCount,
      createdAt: updated.createdAt,
    });
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.goalRepo.delete(id);
    await this.searchService.deleteDocument('goals', id);
    return { message: "Maqsad o'chirildi" };
  }

  async join(goalId: string, userId: string) {
    await this.findOne(goalId);
    const exists = await this.userGoalRepo.findOne({ where: { goalId, userId } });
    if (exists) return exists;
    const userGoal = this.userGoalRepo.create({ goalId, userId });
    await this.userGoalRepo.save(userGoal);
    await this.goalRepo.increment({ id: goalId }, 'memberCount', 1);
    return userGoal;
  }

  async leave(goalId: string, userId: string) {
    await this.userGoalRepo.delete({ goalId, userId });
    await this.goalRepo.decrement({ id: goalId }, 'memberCount', 1);
    return { message: 'Maqsaddan chiqdingiz' };
  }
}
