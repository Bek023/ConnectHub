import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '@/common/pipes/optional-int.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { WebPushService } from './web-push.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private webPush: WebPushService,
  ) {}

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page', new OptionalIntPipe()) page?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.notificationsService.findAll(user.id, page, unreadOnly);
  }

  @Public()
  @Get('push/public-key')
  publicKey() {
    return { publicKey: this.webPush.publicKey };
  }

  @Delete('push/unregister')
  unregisterPush(@Body() body: { token: string }, @CurrentUser() user: any) {
    return this.notificationsService.removePushToken(user.id, body.token);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: any) {
    return this.notificationsService.unreadCount(user.id);
  }

  @Put('read-all')
  markAllRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markRead(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.remove(id, user.id);
  }

  @Post('push/register')
  registerPush(@Body() body: { token: string; platform: string }, @CurrentUser() user: any) {
    return this.notificationsService.registerPushToken(user.id, body.token, body.platform);
  }
}
