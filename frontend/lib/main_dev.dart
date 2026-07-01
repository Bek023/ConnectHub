import 'main.dart' show bootstrap;

/// Dev flavor entry point.
/// Ishga tushirish: flutter run -t lib/main_dev.dart --dart-define=API_URL=...
Future<void> main() async {
  await bootstrap();
}
