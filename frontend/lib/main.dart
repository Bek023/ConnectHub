import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

import 'core/router/app_router.dart';
import 'core/storage/preferences.dart';
import 'core/theme/app_theme.dart';
import 'l10n/app_localizations.dart';
import 'platforms/desktop/desktop_notifications.dart';
import 'platforms/desktop/window_config.dart';
import 'platforms/mobile/push_notification.dart';
import 'shared/providers/locale_provider.dart';
import 'shared/providers/theme_provider.dart';

/// Prod flavor entry point.
Future<void> main() async {
  await bootstrap();
}

/// `main_dev.dart` va `main_staging.dart` bilan baham ko'riladigan
/// initsializatsiya ketma-ketligi.
/// Manba: Flutter Multi-Platform TZ > bo'lim 5 va 6.
Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();

  await configureDesktopWindow();

  if (kIsWeb) {
    usePathUrlStrategy();
  }

  try {
    await Firebase.initializeApp();
    await PushNotificationService.initialize();
  } catch (_) {}

  await DesktopNotificationService.initialize();

  final preferences = await AppPreferences.create();

  runApp(
    ProviderScope(
      overrides: [
        appPreferencesProvider.overrideWithValue(preferences),
      ],
      child: const ConnectHubApp(),
    ),
  );
}

class ConnectHubApp extends ConsumerWidget {
  const ConnectHubApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final themeMode = ref.watch(themeModeProvider);
    final locale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: 'ConnectHub',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: router,
      locale: locale,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('uz'),
        Locale('ru'),
        Locale('en'),
      ],
    );
  }
}
