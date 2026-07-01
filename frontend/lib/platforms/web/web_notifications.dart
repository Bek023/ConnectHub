import '_web_notifications_stub.dart'
    if (dart.library.html) '_web_notifications_web.dart' as impl;

class WebNotifications {
  static Future<bool> requestPermission() =>
      impl.requestNotificationPermission();

  static void show(String title, String body) =>
      impl.showBrowserNotification(title, body);

  static bool get isSupported => impl.isNotificationSupported;
}
