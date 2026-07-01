import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/preferences.dart';

/// `AppPreferences` ni ilova bo'ylab taqdim etish uchun.
/// `main.dart`da `ProviderScope(overrides: [...])` orqali initsializatsiya
/// qilinadi (chunki SharedPreferences.getInstance() async).
final appPreferencesProvider = Provider<AppPreferences>((ref) {
  throw UnimplementedError('main.dart da override qilinishi shart');
});

/// Joriy tema rejimi: dark (default) | light | system.
final themeModeProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>(ThemeModeNotifier.new);

class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() {
    final saved = ref.read(appPreferencesProvider).themeMode;
    return switch (saved) {
      'light' => ThemeMode.light,
      'system' => ThemeMode.system,
      _ => ThemeMode.dark,
    };
  }

  Future<void> setMode(ThemeMode mode) async {
    state = mode;
    final value = switch (mode) {
      ThemeMode.light => 'light',
      ThemeMode.system => 'system',
      ThemeMode.dark => 'dark',
    };
    await ref.read(appPreferencesProvider).setThemeMode(value);
  }
}
