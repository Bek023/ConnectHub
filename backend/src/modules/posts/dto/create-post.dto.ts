import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PostChatType } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({ enum: PostChatType })
  @IsEnum(PostChatType)
  chatType: PostChatType;

  @ApiProperty()
  @IsUUID()
  chatId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  mediaUrls?: string[];
}
