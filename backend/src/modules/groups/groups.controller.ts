import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '@/common/pipes/optional-int.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Public()
  @Get()
  findAll(
    @Query('goalId') goalId?: string,
    @Query('page', new OptionalIntPipe()) page?: number,
    @Query('limit', new OptionalIntPipe()) limit?: number,
  ) {
    return this.groupsService.findAll(goalId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(
    @CurrentUser() user: any,
    @Query('page', new OptionalIntPipe()) page?: number,
    @Query('limit', new OptionalIntPipe()) limit?: number,
  ) {
    return this.groupsService.findMy(user.id, page, limit);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGroupDto, @CurrentUser() user: any) {
    return this.groupsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateGroupDto>, @CurrentUser() user: any) {
    return this.groupsService.update(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.remove(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.join(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join/:code')
  joinByCode(@Param('code') code: string, @CurrentUser() user: any) {
    return this.groupsService.joinByCode(code, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.leave(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/members')
  getMembers(
    @Param('id') id: string,
    @Query('page', new OptionalIntPipe()) page?: number,
    @Query('limit', new OptionalIntPipe()) limit?: number,
  ) {
    return this.groupsService.getMembers(id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/members/:uid')
  updateMemberRole(
    @Param('id') id: string,
    @Param('uid') uid: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.updateMemberRole(id, uid, dto.role, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/members/:uid')
  removeMember(@Param('id') id: string, @Param('uid') uid: string, @CurrentUser() user: any) {
    return this.groupsService.removeMember(id, uid, user.id);
  }
}
