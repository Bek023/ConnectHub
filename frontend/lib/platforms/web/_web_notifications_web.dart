// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

Future<bool> requestNotificationPermission() async {
  if (!isNotificationSupported) return false;
  final permission = await html.Notification.requestPermission();
  return permission == 'granted';
}

void showBrowserNotification(String title, String body) {
  if (html.Notification.permission == 'granted') {
    html.Notification(title, body: body);
  }
}

bool get isNotificationSupported => html.Notification.supported;
