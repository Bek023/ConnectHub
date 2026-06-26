import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTwoFaLoginDto {
  @ApiProperty({ description: 'Login da qaytgan twoFaToken' })
  @IsString()
  twoFaToken: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Kod 6 ta raqamdan iborat' })
  totpCode: string;
}
