import { IsEmail, IsString, Length, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Kod 6 ta raqamdan iborat' })
  code: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 ta belgi bo'lsin" })
  @MaxLength(72)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Parolda katta harf, kichik harf va raqam bo'lishi shart",
  })
  newPassword: string;
}
