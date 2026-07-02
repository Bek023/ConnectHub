import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_exception.dart';
import '../../core/core_providers.dart';
import '../calls/call_socket_service.dart';
import '../chat/chat_socket_service.dart';
import 'auth_repository.dart';
import 'user_model.dart';

part 'auth_notifier.g.dart';

@riverpod
class Auth extends _$Auth {
  @override
  Future<UserModel?> build() async {
    final storage = ref.read(secureStorageProvider);
    final dioClient = ref.read(dioClientProvider);

    dioClient.onSessionExpired = () {
      state = const AsyncData(null);
    };
    ref.onDispose(() {
      if (dioClient.onSessionExpired != null) {
        dioClient.onSessionExpired = null;
      }
    });

    final hasSession = await storage.hasSession();
    if (!hasSession) return null;
    try {
      return await ref.read(authRepositoryProvider).getMe();
    } on ApiException catch (e) {
      if (e.isUnauthorized) {
        await storage.clearTokens();
      }
      return null;
    } catch (_) {
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
    ref.read(chatSocketServiceProvider).disconnect();
    ref.read(callSocketServiceProvider).disconnect();
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncData(null);
  }
}
