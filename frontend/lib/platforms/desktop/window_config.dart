import 'dart:io' show Platform;
import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:window_size/window_size.dart';

/// Desktop oyna o'lchami va sarlavhasini sozlash.
/// `main()` ichida eng birinchi chaqirilishi kerak.
/// Manba: Flutter Multi-Platform TZ > bo'lim 6.
Future<void> configureDesktopWindow() async {
  if (kIsWeb) return;
  if (!Platform.isMacOS && !Platform.isWindows && !Platform.isLinux) return;

  setWindowTitle('ConnectHub');
  setWindowMinSize(const Size(900, 600));
  setWindowMaxSize(Size.infinite);
  setWindowFrame(const Rect.fromLTWH(100, 100, 1280, 800));
}
