import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { UserGoal } from './entities/user-goal.entity';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { SearchModule } from '@/modules/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, UserGoal]), SearchModule],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
