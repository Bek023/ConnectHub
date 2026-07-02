import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Public()
  @Get()
  findAll(
    @Query('goalId') goalId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.channelsService.findAll(goalId, page, limit);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateChannelDto, @CurrentUser() user: any) {
    return this.channelsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateChannelDto>,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.update(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.remove(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.subscribe(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.unsubscribe(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/subscribers')
  getSubscribers(@Param('id') id: string, @Query('page') page?: number) {
    return this.channelsService.getSubscribers(id, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  stats(@Param('id') id: string) {
    return this.channelsService.stats(id);
  }
}
