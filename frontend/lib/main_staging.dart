import 'main.dart' show bootstrap;

/// Staging flavor entry point.
/// Ishga tushirish: flutter run -t lib/main_staging.dart --dart-define=API_URL=...
Future<void> main() async {
  await bootstrap();
}
