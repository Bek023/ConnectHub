import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import '../../core/storage/secure_storage.dart';
import 'user_model.dart';

part 'auth_repository.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepository(
    dioClient: ref.watch(dioClientProvider),
    storage: ref.watch(secureStorageProvider),
  );
}

sealed class LoginResult {}

class LoginSuccess extends LoginResult {
  LoginSuccess(this.user);
  final UserModel user;
}

class LoginRequires2FA extends LoginResult {
  LoginRequires2FA(this.twoFaToken);
  final String twoFaToken;
}

class AuthRepository {
  AuthRepository({required this.dioClient, required this.storage});

  final DioClient dioClient;
  final SecureStorage storage;

  Dio get _dio => dioClient.dio;

  Future<String> register({
    required String username,
    required String email,
    required String password,
    required String displayName,
  }) async {
    try {
      final res = await _dio.post(ApiEndpoints.register, data: {
        'username': username,
        'email': email,
        'password': password,
        'displayName': displayName,
      });
      return res.data['data']['userId'] as String;
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> verifyEmail({
    required String userId,
    required String code,
  }) async {
    try {
      await _dio.post(ApiEndpoints.verifyEmail, data: {
        'userId': userId,
        'code': code,
      });
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> resendVerification(String userId) async {
    try {
      await _dio.post(ApiEndpoints.resendVerification, data: {'userId': userId});
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<LoginResult> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await _dio.post(ApiEndpoints.login, data: {
        'email': email,
        'password': password,
      });
      final data = res.data['data'] as Map<String, dynamic>;

      if (data['requires2FA'] == true) {
        return LoginRequires2FA(data['twoFaToken'] as String);
      }

      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      await storage.saveTokens(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
        userId: user.id,
      );
      return LoginSuccess(user);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<LoginResult> verify2FA({
    required String twoFaToken,
    required String totpCode,
  }) async {
    try {
      final res = await _dio.post(ApiEndpoints.twoFaVerifyLogin, data: {
        'twoFaToken': twoFaToken,
        'totpCode': totpCode,
      });
      final data = res.data['data'] as Map<String, dynamic>;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      await storage.saveTokens(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
        userId: user.id,
      );
      return LoginSuccess(user);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<UserModel> getMe() async {
    try {
      final res = await _dio.get(ApiEndpoints.me);
      return UserModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post(ApiEndpoints.logout);
    } on DioException catch (_) {}
    await storage.clearTokens();
  }

  Future<void> forgotPassword(String email) async {
    try {
      await _dio.post(ApiEndpoints.forgotPassword, data: {'email': email});
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> resetPassword({
    required String email,
    required String code,
    required String newPassword,
  }) async {
    try {
      await _dio.post(ApiEndpoints.resetPassword, data: {
        'email': email,
        'code': code,
        'newPassword': newPassword,
      });
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<UserModel> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
  }) async {
    try {
      final res = await _dio.patch(ApiEndpoints.usersMe, data: {
        if (displayName != null) 'displayName': displayName,
        if (bio != null) 'bio': bio,
        if (avatarUrl != null) 'avatarUrl': avatarUrl,
      });
      return UserModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
