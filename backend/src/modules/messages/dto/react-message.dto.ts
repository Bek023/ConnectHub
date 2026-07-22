import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactMessageDto {
  @ApiProperty({ example: '👍' })
  @IsString()
  @MinLength(1)
  @MaxLength(16)
  emoji: string;
}
