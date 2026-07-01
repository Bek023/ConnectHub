import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/core_providers.dart';
import 'auth_repository.dart';
import 'user_model.dart';

part 'auth_notifier.g.dart';

@riverpod
class Auth extends _$Auth {
  @override
  Future<UserModel?> build() async {
    final storage = ref.read(secureStorageProvider);
    final hasSession = await storage.hasSession();
    if (!hasSession) return null;
    try {
      return await ref.read(authRepositoryProvider).getMe();
    } catch (_) {
      await storage.clearTokens();
      return null;
    }
  }

  Future<String> register({
    required String username,
    required String email,
    required String password,
    required String displayName,
  }) async {
    return ref.read(authRepositoryProvider).register(
          username: username,
          email: email,
          password: password,
          displayName: displayName,
        );
  }

  Future<void> verifyEmail({
    required String userId,
    required String code,
  }) async {
    await ref.read(authRepositoryProvider).verifyEmail(
          userId: userId,
          code: code,
        );
  }

  Future<LoginResult> login({
    required String email,
    required String password,
  }) async {
    final result = await ref.read(authRepositoryProvider).login(
          email: email,
          password: password,
        );
    if (result is LoginSuccess) {
      state = AsyncData(result.user);
    }
    return result;
  }

  Future<LoginResult> verify2FA({
    required String twoFaToken,
    required String totpCode,
  }) async {
    final result = await ref.read(authRepositoryProvider).verify2FA(
          twoFaToken: twoFaToken,
          totpCode: totpCode,
        );
    if (result is LoginSuccess) {
      state = AsyncData(result.user);
    }
    return result;
  }

  Future<void> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
  }) async {
    final updated = await ref.read(authRepositoryProvider).updateProfile(
          displayName: displayName,
          bio: bio,
          avatarUrl: avatarUrl,
        );
    state = AsyncData(updated);
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncData(null);
  }
}
