export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  isActive: boolean;
  twoFaEnabled: boolean;
  createdAt: string;
}

export type PublicUser = Omit<User, 'email'>;

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface VerifyEmailRequest {
  userId: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
  userId: string;
  user: User;
}

export interface LoginRequires2FA {
  requires2FA: true;
  twoFaToken: string;
}

export type LoginResponse = LoginSuccess | LoginRequires2FA;

export interface Verify2FALoginRequest {
  twoFaToken: string;
  totpCode: string;
}

export interface RefreshRequest {
  userId: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface TwoFaSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface TwoFaEnableRequest {
  secret: string;
  totpCode: string;
}

export interface TwoFaDisableRequest {
  totpCode: string;
}

export function isLoginRequires2FA(response: LoginResponse): response is LoginRequires2FA {
  return (response as LoginRequires2FA).requires2FA === true;
}
