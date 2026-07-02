import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '@/common/pipes/optional-int.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Public()
  @Get()
  findAll(
    @Query('page', new OptionalIntPipe()) page?: number,
    @Query('limit', new OptionalIntPipe()) limit?: number,
    @Query('category') category?: string,
    @Query('q') q?: string,
  ) {
    return this.goalsService.findAll(page, limit, category, q);
  }

  @Public()
  @Get('trending')
  trending() {
    return this.goalsService.trending();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  myGoals(@CurrentUser() user: any) {
    return this.goalsService.myGoals(user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGoalDto) {
    return this.goalsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateGoalDto>) {
    return this.goalsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: any) {
    return this.goalsService.join(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.goalsService.leave(id, user.id);
  }
}
