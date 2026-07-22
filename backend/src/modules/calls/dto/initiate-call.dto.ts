import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CallType } from '../entities/call.entity';

export class InitiateCallDto {
  @ApiProperty()
  @IsUUID()
  chatId: string;

  @ApiProperty({ enum: CallType })
  @IsEnum(CallType)
  type: CallType;
}
