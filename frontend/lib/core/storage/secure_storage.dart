import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// JWT token saqlash uchun platform-aware wrapper.
/// Mobile/Desktop: Keychain/Keystore. Web: flutter_secure_storage'ning
/// localStorage fallback'i (TZ: "Flutter Multi-Platform" > Xavfsizlik).
class SecureStorage {
  SecureStorage({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _kAccessToken = 'accessToken';
  static const _kRefreshToken = 'refreshToken';
  static const _kUserId = 'userId';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
    required String userId,
  }) async {
    await Future.wait([
      _storage.write(key: _kAccessToken, value: accessToken),
      _storage.write(key: _kRefreshToken, value: refreshToken),
      _storage.write(key: _kUserId, value: userId),
    ]);
  }

  Future<String?> readAccessToken() => _storage.read(key: _kAccessToken);
  Future<String?> readRefreshToken() => _storage.read(key: _kRefreshToken);
  Future<String?> readUserId() => _storage.read(key: _kUserId);

  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: _kAccessToken),
      _storage.delete(key: _kRefreshToken),
      _storage.delete(key: _kUserId),
    ]);
  }

  Future<bool> hasSession() async {
    final token = await readAccessToken();
    return token != null && token.isNotEmpty;
  }
}
