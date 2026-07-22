import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PushPlatform } from '../entities/push-token.entity';

export class RegisterPushDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  token: string;

  @ApiProperty({ enum: PushPlatform })
  @IsEnum(PushPlatform)
  platform: PushPlatform;
}

export class UnregisterPushDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  token: string;
}
