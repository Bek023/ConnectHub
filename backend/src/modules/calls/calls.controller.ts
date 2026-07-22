import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '@/common/pipes/optional-int.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { CallType } from './entities/call.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { InitiateCallDto } from './dto/initiate-call.dto';

@ApiTags('Calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Post('initiate')
  initiate(@Body() dto: InitiateCallDto, @CurrentUser() user: any) {
    return this.callsService.create({ ...dto, initiatorId: user.id });
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: any) {
    return this.callsService.join(id, user.id);
  }

  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.callsService.leave(id, user.id);
  }

  @Post(':id/end')
  end(@Param('id') id: string, @CurrentUser() user: any) {
    return this.callsService.end(id, user.id);
  }

  @Get('active')
  active(@Query('chatId') chatId: string, @CurrentUser() user: any) {
    return this.callsService.activeForChat(chatId, user.id);
  }

  @Get(':id/participants')
  participants(@Param('id') id: string) {
    return this.callsService.getParticipants(id);
  }

  @Get('history')
  history(@CurrentUser() user: any, @Query('page', new OptionalIntPipe()) page?: number) {
    return this.callsService.history(user.id, page);
  }
}
