import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { EditMessageDto } from './dto/edit-message.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':chatType/:chatId')
  findByChat(
    @Param('chatType') chatType: string,
    @Param('chatId') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.messagesService.findByChat(chatType, chatId, cursor, limit);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() dto: EditMessageDto, @CurrentUser() user: any) {
    return this.messagesService.edit(id, user.id, dto.content);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.delete(id, user.id);
  }

  @Post(':id/react')
  react(@Param('id') id: string, @Body() body: { emoji: string }, @CurrentUser() user: any) {
    return this.messagesService.react(id, user.id, body.emoji);
  }

  @Get(':id/read-by')
  readBy(@Param('id') id: string) {
    return this.messagesService.readBy(id);
  }
}
