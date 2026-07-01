import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/notifications/notifications_repository.dart';

class FcmTokenManager {
  FcmTokenManager._();

  static Future<void> registerIfNeeded(Ref ref) async {
    if (kIsWeb) return;
    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token == null) return;

      final platform = _currentPlatform();
      await ref
          .read(notificationsRepositoryProvider)
          .registerPushToken(token: token, platform: platform);

      FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
        try {
          await ref
              .read(notificationsRepositoryProvider)
              .registerPushToken(token: newToken, platform: platform);
        } catch (_) {}
      });
    } catch (_) {}
  }

  static String _currentPlatform() {
    if (kIsWeb) return 'web';
    try {
      final platform = defaultTargetPlatform;
      return switch (platform) {
        TargetPlatform.android => 'android',
        TargetPlatform.iOS => 'ios',
        TargetPlatform.macOS => 'macos',
        TargetPlatform.windows => 'windows',
        TargetPlatform.linux => 'linux',
        _ => 'unknown',
      };
    } catch (_) {
      return 'unknown';
    }
  }
}
