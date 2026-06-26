import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnableTwoFaDto {
  @ApiProperty({ description: 'Setup dan qaytgan base32 secret' })
  @IsString()
  secret: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Kod 6 ta raqamdan iborat' })
  totpCode: string;
}
