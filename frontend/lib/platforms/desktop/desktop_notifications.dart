import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class DesktopNotificationService {
  DesktopNotificationService._();

  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static bool get isSupported {
    if (kIsWeb) return false;
    return Platform.isMacOS || Platform.isLinux || Platform.isWindows;
  }

  static Future<void> initialize() async {
    if (!isSupported || _initialized) return;
    try {
      final initSettings = InitializationSettings(
        macOS: Platform.isMacOS
            ? const DarwinInitializationSettings(
                requestAlertPermission: true,
                requestBadgePermission: true,
                requestSoundPermission: true,
              )
            : null,
        linux: Platform.isLinux
            ? const LinuxInitializationSettings(defaultActionName: 'Ochish')
            : null,
      );
      await _plugin.initialize(initSettings);
      _initialized = true;
    } catch (_) {}
  }

  static Future<void> requestPermission() async {
    if (!isSupported || !_initialized) return;
    if (Platform.isMacOS) {
      await _plugin
          .resolvePlatformSpecificImplementation<
              MacOSFlutterLocalNotificationsPlugin>()
          ?.requestPermissions(alert: true, badge: true, sound: true);
    }
  }

  static Future<void> show({
    required String title,
    required String body,
    String? payload,
  }) async {
    if (!isSupported) return;
    if (!_initialized) await initialize();
    if (!_initialized) return;
    try {
      final details = NotificationDetails(
        macOS: Platform.isMacOS
            ? const DarwinNotificationDetails(
                presentAlert: true,
                presentBadge: true,
                presentSound: true,
              )
            : null,
        linux: Platform.isLinux
            ? const LinuxNotificationDetails(
                urgency: LinuxNotificationUrgency.normal,
              )
            : null,
      );
      await _plugin.show(
        DateTime.now().millisecondsSinceEpoch ~/ 1000,
        title,
        body,
        details,
        payload: payload,
      );
    } catch (_) {}
  }
}
