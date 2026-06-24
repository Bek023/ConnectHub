import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { CallType } from './entities/call.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Post('initiate')
  initiate(@Body() body: { chatId: string; type: CallType }, @CurrentUser() user: any) {
    return this.callsService.create({ ...body, initiatorId: user.id });
  }

  @Post(':id/join')
  join(@Param('id') id: string) {
    return this.callsService.join(id);
  }

  @Post(':id/end')
  end(@Param('id') id: string, @CurrentUser() user: any) {
    return this.callsService.end(id, user.id);
  }

  @Get(':id/participants')
  participants(@Param('id') id: string) {
    return this.callsService.getParticipants(id);
  }

  @Get('history')
  history(@CurrentUser() user: any, @Query('page') page?: number) {
    return this.callsService.history(user.id, page);
  }
}
