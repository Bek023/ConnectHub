import 'package:flutter/foundation.dart';
import 'dart:io' as io show Platform;

/// Platforma tekshiruvlari uchun markazlashtirilgan joy.
/// `dart:io`ga to'g'ridan-to'g'ri murojaat o'rniga shu klassdan foydalaning —
/// web'da `dart:io` ishlamaydi, shuning uchun har bir getter `kIsWeb`ni
/// birinchi tekshiradi.
/// Manba: Flutter Multi-Platform TZ > bo'lim 4.
abstract class PlatformService {
  static bool get isWeb => kIsWeb;

  static bool get isMobile =>
      !kIsWeb && (io.Platform.isAndroid || io.Platform.isIOS);

  static bool get isDesktop =>
      !kIsWeb &&
      (io.Platform.isMacOS || io.Platform.isWindows || io.Platform.isLinux);

  static bool get isAndroid => !kIsWeb && io.Platform.isAndroid;
  static bool get isIOS => !kIsWeb && io.Platform.isIOS;
  static bool get isMacOS => !kIsWeb && io.Platform.isMacOS;
  static bool get isWindows => !kIsWeb && io.Platform.isWindows;
  static bool get isLinux => !kIsWeb && io.Platform.isLinux;

  /// Biometrik faqat mobile'da (local_auth web'da ishlamaydi).
  static bool get supportsBiometric => isMobile;

  /// Push notification (FCM) faqat mobile'da.
  static bool get supportsPushNotification => isMobile;

  /// Browser Notification API faqat web'da.
  static bool get supportsWebNotification => isWeb;

  /// Desktop oyna boshqaruvi (window_size, bitsdojo_window).
  static bool get supportsWindowManagement => isDesktop;
}
