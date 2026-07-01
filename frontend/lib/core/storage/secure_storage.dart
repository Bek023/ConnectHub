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

  Future<String?> readAccessToken() => _safeRead(_kAccessToken);
  Future<String?> readRefreshToken() => _safeRead(_kRefreshToken);
  Future<String?> readUserId() => _safeRead(_kUserId);

  /// Saqlangan qiymatni shifrdan chiqarishda xato yuz bersa (masalan,
  /// web'da IndexedDB'dagi shifrlash kaliti eskirgan/mos kelmasa),
  /// buzilgan yozuvni tozalab, sessiya yo'q deb hisoblaymiz — bunday
  /// xato butun ilovani (jumladan login so'rovini) bloklamasligi kerak.
  Future<String?> _safeRead(String key) async {
    try {
      return await _storage.read(key: key);
    } catch (_) {
      await _storage.delete(key: key);
      return null;
    }
  }

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
