import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class EditMessageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  content: string;
}
