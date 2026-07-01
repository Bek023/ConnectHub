import 'package:shared_preferences/shared_preferences.dart';

/// Nozik sozlamalar (tema, til, onboarding holati va h.k.) uchun wrapper.
/// Token kabi maxfiy ma'lumotlar bu yerda emas — [SecureStorage]da saqlanadi.
class AppPreferences {
  AppPreferences(this._prefs);

  final SharedPreferences _prefs;

  static Future<AppPreferences> create() async {
    final prefs = await SharedPreferences.getInstance();
    return AppPreferences(prefs);
  }

  static const _kThemeMode = 'theme_mode'; // 'dark' | 'light' | 'system'
  static const _kLocale = 'locale'; // 'uz' | 'ru' | 'en'
  static const _kOnboardingDone = 'onboarding_done';
  static const _kPinHash = 'pin_hash';
  static const _kBiometricEnabled = 'biometric_enabled';

  String get themeMode => _prefs.getString(_kThemeMode) ?? 'dark';
  Future<void> setThemeMode(String mode) => _prefs.setString(_kThemeMode, mode);

  String get locale => _prefs.getString(_kLocale) ?? 'uz';
  Future<void> setLocale(String locale) => _prefs.setString(_kLocale, locale);

  bool get onboardingDone => _prefs.getBool(_kOnboardingDone) ?? false;
  Future<void> setOnboardingDone(bool value) =>
      _prefs.setBool(_kOnboardingDone, value);

  // PIN hash — SHA-256 (crypto paketi), xom PIN hech qachon saqlanmaydi.
  String? get pinHash => _prefs.getString(_kPinHash);
  Future<void> setPinHash(String? hash) => hash == null
      ? _prefs.remove(_kPinHash)
      : _prefs.setString(_kPinHash, hash);

  bool get biometricEnabled => _prefs.getBool(_kBiometricEnabled) ?? false;
  Future<void> setBiometricEnabled(bool value) =>
      _prefs.setBool(_kBiometricEnabled, value);
}
