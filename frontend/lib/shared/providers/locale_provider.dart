import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'theme_provider.dart' show appPreferencesProvider;

/// Tanlangan til: uz (default) | ru | en.
/// Manba: Flutter Multi-Platform TZ > bo'lim 10 (Lokalizatsiya).
final localeProvider =
    NotifierProvider<LocaleNotifier, Locale>(LocaleNotifier.new);

class LocaleNotifier extends Notifier<Locale> {
  @override
  Locale build() {
    final saved = ref.read(appPreferencesProvider).locale;
    return Locale(saved);
  }

  Future<void> setLocale(String languageCode) async {
    state = Locale(languageCode);
    await ref.read(appPreferencesProvider).setLocale(languageCode);
  }
}
