import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ChatType, MessageType } from '../entities/message.entity';

export class SendMessageDto {
  @ApiProperty()
  @IsUUID()
  chatId: string;

  @ApiProperty({ enum: ChatType })
  @IsEnum(ChatType)
  chatType: ChatType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content?: string;

  @ApiPropertyOptional({ enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  replyTo?: string;
}
