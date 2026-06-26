import { Controller, Post, Body, Get, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EnableTwoFaDto } from './dto/enable-2fa.dto';
import { DisableTwoFaDto } from './dto/disable-2fa.dto';
import { VerifyTwoFaLoginDto } from './dto/verify-2fa-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Ro'yxatdan o'tish", description: 'Yangi foydalanuvchi yaratadi va emailga tasdiqlash kodi yuboradi.' })
  @ApiResponse({ status: 201, description: 'Tasdiqlash kodi emailga yuborildi', schema: { example: { message: 'Tasdiqlash kodi emailga yuborildi', userId: 'uuid' } } })
  @ApiResponse({ status: 409, description: 'Email yoki username band' })
  @ApiResponse({ status: 429, description: "Juda ko'p so'rov" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Kirish', description: '5 marta noto\'g\'ri parol kiritilsa 15 daqiqa bloklash. 2FA yoqilgan bo\'lsa requires2FA: true va twoFaToken qaytadi.' })
  @ApiResponse({ status: 200, schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...', userId: 'uuid' } } })
  @ApiResponse({ status: 200, description: '2FA kerak bo\'lsa', schema: { example: { requires2FA: true, twoFaToken: 'uuid' } } })
  @ApiResponse({ status: 401, description: "Email/parol noto'g'ri, email tasdiqlanmagan, yoki juda ko'p urinish" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('verify-email')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Emailni tasdiqlash', description: '6 raqamli OTP kodni tasdiqlaydi. Kod 10 daqiqa amal qiladi.' })
  @ApiResponse({ status: 201, schema: { example: { message: 'Email tasdiqlandi' } } })
  @ApiResponse({ status: 400, description: "Kod noto'g'ri yoki muddati tugagan" })
  @ApiResponse({ status: 429, description: "Juda ko'p urinish" })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.userId, dto.code);
  }

  @Public()
  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Tasdiqlash kodini qayta yuborish', description: '60 soniya cooldown.' })
  @ApiResponse({ status: 201, schema: { example: { message: 'Yangi tasdiqlash kodi emailga yuborildi' } } })
  @ApiResponse({ status: 400, description: 'Topilmadi, tasdiqlangan, yoki cooldown' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationCode(dto.userId);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Parolni tiklash so\'rovi', description: 'Email enumeration oldini olish uchun foydalanuvchi topilmasa ham bir xil javob. isActive: false foydalanuvchilarga kod yuborilmaydi.' })
  @ApiResponse({ status: 200, schema: { example: { message: "Agar email mavjud bo'lsa, kod yuboriladi" } } })
  @ApiResponse({ status: 400, description: 'Cooldown aktiv' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Parolni yangilash', description: 'OTP kodni tekshirib, parolni yangilaydi. Kod 10 daqiqa.' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Parol muvaffaqiyatli yangilandi' } } })
  @ApiResponse({ status: 400, description: "Kod noto'g'ri yoki muddati tugagan" })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tokenni yangilash' })
  @ApiResponse({ status: 200, schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...', userId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Refresh token yaroqsiz' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chiqish', description: 'Refresh tokenni o\'chiradi va access tokenni blacklist qiladi.' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqildi' })
  @ApiResponse({ status: 401, description: 'Token yo\'q yoki yaroqsiz' })
  logout(@CurrentUser() user: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.authService.logout(user.id, token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy foydalanuvchi' })
  @ApiResponse({ status: 200, description: "Foydalanuvchi ma'lumotlari" })
  @ApiResponse({ status: 401, description: 'Token yo\'q yoki yaroqsiz' })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parolni o\'zgartirish', description: 'Login bo\'lgan foydalanuvchi eski parolini bilgan holda o\'zgartiradi.' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Parol muvaffaqiyatli yangilandi' } } })
  @ApiResponse({ status: 400, description: "Joriy parol noto'g'ri" })
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '2FA sozlash', description: 'Base32 secret va QR kod URL qaytaradi. Hali yoqilmaydi — enable qilish uchun /2fa/enable ga yuboring.' })
  @ApiResponse({ status: 201, schema: { example: { secret: 'BASE32SECRET', qrCodeUrl: 'data:image/png;base64,...' } } })
  setupTwoFa(@CurrentUser() user: any) {
    return this.authService.setupTwoFa(user.id);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '2FA yoqish', description: 'Setup dan kelgan secret va TOTP kodni tasdiqlaydi, keyin 2FA ni yoqadi.' })
  @ApiResponse({ status: 200, schema: { example: { message: '2FA yoqildi' } } })
  @ApiResponse({ status: 400, description: "Kod noto'g'ri" })
  enableTwoFa(@CurrentUser() user: any, @Body() dto: EnableTwoFaDto) {
    return this.authService.enableTwoFa(user.id, dto.secret, dto.totpCode);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '2FA o\'chirish', description: 'TOTP kodni tekshirib 2FA ni o\'chiradi.' })
  @ApiResponse({ status: 200, schema: { example: { message: "2FA o'chirildi" } } })
  @ApiResponse({ status: 400, description: "Kod noto'g'ri yoki 2FA allaqachon o'chirilgan" })
  disableTwoFa(@CurrentUser() user: any, @Body() dto: DisableTwoFaDto) {
    return this.authService.disableTwoFa(user.id, dto.totpCode);
  }

  @Public()
  @Post('2fa/verify-login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: '2FA bilan login yakunlash', description: 'Login da qaytgan twoFaToken va TOTP kodni tekshirib, haqiqiy tokenlarni qaytaradi.' })
  @ApiResponse({ status: 200, schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...', userId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Token yoki TOTP kod yaroqsiz' })
  verifyTwoFaLogin(@Body() dto: VerifyTwoFaLoginDto) {
    return this.authService.verifyTwoFaLogin(dto.twoFaToken, dto.totpCode);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  googleCallback(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }
}
