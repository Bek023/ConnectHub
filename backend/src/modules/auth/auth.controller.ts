import { Controller, Post, Body, Get, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiBody,
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
  @ApiResponse({ status: 429, description: 'Juda ko\'p so\'rov (rate limit)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Kirish', description: 'Email va parol bilan tizimga kiradi. Email tasdiqlanmagan bo\'lsa 401 qaytaradi.' })
  @ApiResponse({ status: 200, description: 'Access va refresh tokenlar qaytariladi', schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...', userId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Email/parol noto\'g\'ri yoki email tasdiqlanmagan' })
  @ApiResponse({ status: 429, description: 'Juda ko\'p so\'rov (rate limit)' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'Emailni tasdiqlash', description: 'Ro\'yxatdan o\'tishdan so\'ng emailga kelgan 6 raqamli OTP kodni tasdiqlaydi. Kod 10 daqiqa amal qiladi.' })
  @ApiResponse({ status: 201, description: 'Email tasdiqlandi', schema: { example: { message: 'Email tasdiqlandi' } } })
  @ApiResponse({ status: 400, description: 'Kod noto\'g\'ri yoki muddati tugagan' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.userId, dto.code);
  }

  @Public()
  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Tasdiqlash kodini qayta yuborish', description: 'Email tasdiqlanmagan foydalanuvchiga yangi OTP yuboradi. 60 soniya cooldown mavjud.' })
  @ApiResponse({ status: 201, description: 'Yangi kod yuborildi', schema: { example: { message: 'Yangi tasdiqlash kodi emailga yuborildi' } } })
  @ApiResponse({ status: 400, description: 'Foydalanuvchi topilmadi, allaqachon tasdiqlangan, yoki cooldown aktiv' })
  @ApiResponse({ status: 429, description: 'Juda ko\'p so\'rov (rate limit)' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationCode(dto.userId);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Parolni tiklash so\'rovi', description: 'Email manzilga 6 raqamli OTP yuboradi. Email mavjud bo\'lmasa ham bir xil javob qaytaradi (email enumeration oldini olish). 60 soniya cooldown.' })
  @ApiResponse({ status: 200, description: 'Kod yuborildi (yoki email topilmadi — xavfsiz javob)', schema: { example: { message: 'Agar email mavjud bo\'lsa, kod yuboriladi' } } })
  @ApiResponse({ status: 400, description: 'Cooldown aktiv' })
  @ApiResponse({ status: 429, description: 'Juda ko\'p so\'rov (rate limit)' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Parolni yangilash', description: 'OTP kodni tekshirib, parolni yangilaydi. Kod 10 daqiqa amal qiladi.' })
  @ApiResponse({ status: 200, description: 'Parol muvaffaqiyatli yangilandi', schema: { example: { message: 'Parol muvaffaqiyatli yangilandi' } } })
  @ApiResponse({ status: 400, description: 'Kod noto\'g\'ri yoki muddati tugagan' })
  @ApiResponse({ status: 429, description: 'Juda ko\'p so\'rov (rate limit)' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tokenni yangilash', description: 'Refresh token orqali yangi access va refresh token juftligini oladi.' })
  @ApiResponse({ status: 200, description: 'Yangi tokenlar', schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...', userId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Refresh token yaroqsiz yoki muddati tugagan' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chiqish', description: 'Refresh tokenni bekor qiladi. Keyingi refresh so\'rovlar ishlamaydi.' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqildi' })
  @ApiResponse({ status: 401, description: 'Token yo\'q yoki yaroqsiz' })
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy foydalanuvchi', description: 'Access token orqali joriy foydalanuvchi ma\'lumotlarini qaytaradi.' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 401, description: 'Token yo\'q yoki yaroqsiz' })
  getMe(@CurrentUser() user: any) {
    return user;
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
