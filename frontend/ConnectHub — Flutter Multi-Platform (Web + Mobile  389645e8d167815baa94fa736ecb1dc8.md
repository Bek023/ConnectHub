# ConnectHub — Flutter Multi-Platform (Web + Mobile + Desktop) TZ

> Bu hujjat **Flutter Web + Mobile + Desktop** ishlab chiquvchisi uchun. Bitta codebase orqali barcha platformalarda ishlaydigan ConnectHub ilovasining to'liq texnik spesifikatsiyasi — Clean Architecture, adaptive UI, platform-specific optimizatsiyalar.
> 

---

# 1. 🏗️ Texnik Stack

## Core

| Texnologiya | Versiya | Maqsad |
| --- | --- | --- |
| **Flutter** | 3.22.x (stable) | Cross-platform framework |
| **Dart** | 3.4.x | Dasturlash tili |
| **Flavors** | dev / staging / prod | Muhit ajratish |
| **Target platformalar** | Web, Android, iOS, macOS, Windows | Multi-platform |

## State Management

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **flutter_riverpod** | ^2.5.1 | Global state management |
| **riverpod_annotation** | ^2.3.5 | Code generation |
| **freezed** | ^2.5.2 | Immutable model |
| **freezed_annotation** | ^2.4.1 | Annotation |

## Navigatsiya

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **go_router** | ^13.2.0 | Declarative routing + deep link (web URL) |

## Adaptive UI

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **flutter_adaptive_scaffold** | ^0.2.0 | Material 3 adaptive layout |
| **window_size** | ^0.1.0 | Desktop oyna o'lchami |
| **bitsdojo_window** | ^0.1.6 | Custom desktop title bar |

## Network va API

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **dio** | ^5.4.3 | HTTP client |
| **retrofit** | ^4.1.0 | Type-safe API client |
| **pretty_dio_logger** | ^1.3.1 | Request/response log |

## Real-vaqt

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **socket_io_client** | ^2.0.3+1 | WebSocket ([Socket.io](http://Socket.io)) — web + mobile + desktop |

## WebRTC

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **flutter_webrtc** | ^0.10.7 | Audio/Video call — barcha platformalar |

## Xavfsizlik

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **flutter_secure_storage** | ^9.2.2 | JWT token (web: localStorage fallback) |
| **shared_preferences** | ^2.3.2 | Sozlamalar |
| **crypto** | ^3.0.3 | SHA-256 PIN hash |

> ⚠️ **Web eslatma:** `local_auth` (biometrik) web platformada ishlamaydi. Platform check bilan o'chirib qo'yiladi.
> 

## Mahalliy Saqlash

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **isar** | ^3.1.0+1 | Mobile + Desktop (web da indexedDB yoki sembast) |
| **sembast** | ^3.6.0 | Web uchun alternativ local DB |

## Media

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **image_picker** | ^1.1.2 | Galereya/kamera (web: file input) |
| **file_picker** | ^8.1.2 | Fayl tanlash — barcha platformalar |
| **video_player** | ^2.9.1 | Video ijro |
| **cached_network_image** | ^3.3.1 | Tarmoq rasmi kesh |
| **photo_view** | ^0.15.0 | Rasm zoom/pan |

## SEO va Web Optimizatsiya

| Paket / Yondashuv | Maqsad |
| --- | --- |
| **flutter_meta_seo** | Dynamic og:title, og:description, og:image |
| HTML renderer | `--web-renderer html` — SEO yaxshiroq |
| [Prerender.io](http://Prerender.io) | Bot uchun server-side HTML |
| `url_strategy` | Hash (`#`) ni URL dan olib tashlash |

## Bildirishnomalar

| Paket | Maqsad |
| --- | --- |
| **firebase_messaging** | Mobile: FCM Push notification |
| **flutter_local_notifications** | Mobile + Desktop: mahalliy bildirishnoma |
| **web_browser_detect** | Web: Browser Notification API |

## UI / UX

| Paket | Versiya | Maqsad |
| --- | --- | --- |
| **lottie** | ^3.1.2 | Animatsiya |
| **shimmer** | ^3.0.0 | Skeleton loader |
| **flutter_animate** | ^4.5.0 | Micro-animatsiyalar |
| **gap** | ^3.0.1 | SizedBox o'rniga |
| **flex_color_scheme** | ^8.0.2 | Tema tizimi |
| **flutter_svg** | ^2.0.10+1 | SVG ikonlar |
| **emoji_picker_flutter** | ^2.2.0 | Emoji picker |

## Utility

| Paket | Maqsad |
| --- | --- |
| **connectivity_plus** | Internet ulanish holati |
| **intl** | Lokalizatsiya (UZ/RU/EN) |
| **url_launcher** | URL ochish |
| **share_plus** | Ulashish (web: Web Share API) |
| **sentry_flutter** | Crash monitoring |

---

# 2. 📁 Loyiha Tuzilmasi (Feature-first + Platform-adaptive)

```
lib/
├── main.dart                        # Entry point (prod)
├── main_dev.dart                    # Dev flavor
├── main_staging.dart                # Staging flavor
│
├── core/
│   ├── api/
│   │   ├── dio_client.dart
│   │   ├── api_endpoints.dart
│   │   └── api_exception.dart
│   ├── router/
│   │   ├── app_router.dart          # go_router (URL-based, web friendly)
│   │   ├── app_routes.dart
│   │   └── router_guard.dart
│   ├── theme/
│   │   ├── app_colors.dart
│   │   ├── app_text_styles.dart
│   │   ├── app_theme.dart
│   │   └── app_spacing.dart
│   ├── storage/
│   │   ├── secure_storage.dart      # Platform-aware wrapper
│   │   ├── preferences.dart
│   │   └── local_db_service.dart    # Isar (mobile/desktop) / Sembast (web)
│   ├── socket/
│   │   ├── socket_client.dart
│   │   └── socket_events.dart
│   ├── platform/
│   │   ├── platform_service.dart    # kIsWeb, Platform.isDesktop tekshiruv
│   │   ├── window_manager.dart      # Desktop oyna boshqaruvi
│   │   └── seo_service.dart         # Web SEO meta tags
│   └── utils/
│       ├── extensions.dart
│       ├── validators.dart
│       └── logger.dart
│
├── features/
│   ├── auth/
│   ├── feed/
│   ├── goals/
│   ├── groups/
│   ├── channels/
│   ├── chat/
│   ├── calls/
│   ├── posts/
│   ├── notifications/
│   ├── profile/
│   └── settings/
│
├── shared/
│   ├── widgets/
│   │   ├── app_avatar.dart
│   │   ├── app_button.dart
│   │   ├── app_text_field.dart
│   │   └── ...
│   └── providers/
│       ├── theme_provider.dart
│       └── locale_provider.dart
│
├── platforms/
│   ├── web/
│   │   ├── web_seo.dart             # Meta tag boshqaruvi
│   │   ├── web_notifications.dart   # Browser Notification API
│   │   └── web_file_handler.dart    # Web file upload
│   ├── mobile/
│   │   ├── push_notification.dart   # FCM
│   │   └── biometric_handler.dart   # local_auth
│   └── desktop/
│       ├── window_config.dart       # Oyna o'lchami, title bar
│       └── desktop_notifications.dart
│
└── l10n/
    ├── app_uz.arb
    ├── app_ru.arb
    └── app_en.arb
```

---

# 3. 🏛️ Arxitektura — Clean Architecture + Riverpod

```
┌─────────────────────────────────────────┐
│     Presentation Layer                  │
│     Screens, Widgets, Providers         │
│     + Adaptive Layout (LayoutBuilder)   │
├─────────────────────────────────────────┤
│     Domain Layer                        │
│     Models (Freezed), UseCases, State   │
├─────────────────────────────────────────┤
│     Data Layer                          │
│     Repository, API (Retrofit), Local DB│
└─────────────────────────────────────────┘
```

---

# 4. 📱💻🖥️ Adaptive UI — Responsive Layout

Flutter da multi-platform UI uchun **LayoutBuilder + AdaptiveScaffold** kombinatsiyasi ishlatiladi.

## Breakpoint tizimi

| Breakpoint | Kenglik | Layout |
| --- | --- | --- |
| **Compact** | < 600px | Mobile: BottomNavigationBar |
| **Medium** | 600–840px | Tablet/Web: NavigationRail |
| **Expanded** | > 840px | Desktop/Web: NavigationDrawer + side panel |

## AdaptiveScaffold misoli

```dart
// shared/widgets/adaptive_app_shell.dart
import 'package:flutter/material.dart';
import 'package:flutter_adaptive_scaffold/flutter_adaptive_scaffold.dart';
import 'package:go_router/go_router.dart';

class AdaptiveAppShell extends StatelessWidget {
  final Widget child;
  final int selectedIndex;

  const AdaptiveAppShell({
    super.key,
    required this.child,
    required this.selectedIndex,
  });

  static const _destinations = [
    NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Feed'),
    NavigationDestination(icon: Icon(Icons.flag_outlined), selectedIcon: Icon(Icons.flag), label: 'Maqsadlar'),
    NavigationDestination(icon: Icon(Icons.group_outlined), selectedIcon: Icon(Icons.group), label: 'Guruhlar'),
    NavigationDestination(icon: Icon(Icons.campaign_outlined), selectedIcon: Icon(Icons.campaign), label: 'Kanallar'),
    NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profil'),
  ];

  void _onDestinationSelected(BuildContext context, int index) {
    switch (index) {
      case 0: context.go('/feed');
      case 1: context.go('/goals');
      case 2: context.go('/groups');
      case 3: context.go('/channels');
      case 4: context.go('/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    return AdaptiveScaffold(
      selectedIndex: selectedIndex,
      onSelectedIndexChange: (i) => _onDestinationSelected(context, i),
      destinations: _destinations,
      body: (_) => child,
      // Desktop: secondary panel (chat preview)
      secondaryBody: Breakpoints.mediumAndUp.isActive(context)
          ? (_) => const ChatPreviewPanel()
          : null,
    );
  }
}
```

## Platform-specific tekshiruv

```dart
// core/platform/platform_service.dart
import 'package:flutter/foundation.dart';
import 'dart:io' show Platform;

class PlatformService {
  static bool get isWeb => kIsWeb;
  static bool get isMobile => !kIsWeb && (Platform.isAndroid || Platform.isIOS);
  static bool get isDesktop => !kIsWeb && (Platform.isMacOS || Platform.isWindows || Platform.isLinux);
  static bool get isAndroid => !kIsWeb && Platform.isAndroid;
  static bool get isIOS => !kIsWeb && Platform.isIOS;
  static bool get isMacOS => !kIsWeb && Platform.isMacOS;
  static bool get isWindows => !kIsWeb && Platform.isWindows;

  // Biometrik faqat mobile da
  static bool get supportsBiometric => isMobile;

  // Push notification
  static bool get supportsPushNotification => isMobile;

  // Web notification
  static bool get supportsWebNotification => isWeb;

  // Desktop window management
  static bool get supportsWindowManagement => isDesktop;
}
```

---

# 5. 🌐 Web-specific Optimizatsiyalar

## URL Strategy — Hash olib tashlash

```dart
// main.dart
import 'package:flutter/foundation.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

void main() {
  if (kIsWeb) {
    usePathUrlStrategy(); // connecthub.uz/feed (# siz)
  }
  runApp(const ProviderScope(child: ConnectHubApp()));
}
```

## SEO — Dynamic Meta Tags

```dart
// core/platform/seo_service.dart
import 'package:flutter/foundation.dart';
import 'package:flutter_meta_seo/flutter_meta_seo.dart';

class SeoService {
  static void setMeta({
    required String title,
    required String description,
    String? imageUrl,
    String? url,
  }) {
    if (!kIsWeb) return;

    final metaSeo = MetaSeo();
    metaSeo.ogTitle(ogTitle: title);
    metaSeo.ogDescription(ogDescription: description);
    if (imageUrl != null) metaSeo.ogImage(ogImage: imageUrl);
    if (url != null) metaSeo.ogUrl(ogUrl: url);
    metaSeo.twitterTitle(twitterTitle: title);
    metaSeo.twitterDescription(twitterDescription: description);
  }

  // Profil sahifasi uchun
  static void setProfileMeta(String username, String bio, String avatarUrl) {
    setMeta(
      title: '$username | ConnectHub',
      description: bio.length > 160 ? bio.substring(0, 157) + '...' : bio,
      imageUrl: avatarUrl,
      url: 'https://connecthub.uz/profile/$username',
    );
  }

  // Post sahifasi uchun
  static void setPostMeta(String title, String preview, String? mediaUrl) {
    setMeta(
      title: '$title | ConnectHub',
      description: preview,
      imageUrl: mediaUrl,
    );
  }
}
```

## Web Build konfiguratsiya

```bash
# HTML renderer (SEO uchun yaxshiroq)
flutter build web \
  --web-renderer html \
  --dart-define=API_URL=https://api.connecthub.uz/v1 \
  --dart-define=WS_URL=wss://ws.connecthub.uz \
  --release

# CanvasKit (performance yaxshi, lekin SEO zaif)
flutter build web --web-renderer canvaskit --release
```

## Nginx — Prerendering + Flutter Web

```
# /etc/nginx/sites-available/connecthub
server {
    listen 80;
    server_name connecthub.uz;
    root /var/www/connecthub/web;
    index index.html;

    # Bot uchun prerender
    set $prerender 0;
    if ($http_user_agent ~* "googlebot|bingbot|yandexbot|facebookexternalhit|twitterbot") {
        set $prerender 1;
    }

    location / {
        if ($prerender = 1) {
            proxy_pass http://127.0.0.1:3000;  # Rendertron yoki prerender.io
        }
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|ico|wasm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

# 6. 🖥️ Desktop-specific Sozlamalar

## Oyna o'lchami va title bar

```dart
// platforms/desktop/window_config.dart
import 'package:flutter/foundation.dart';
import 'package:window_size/window_size.dart';
import 'dart:io' show Platform;

Future<void> configureDesktopWindow() async {
  if (kIsWeb) return;
  if (!Platform.isMacOS && !Platform.isWindows && !Platform.isLinux) return;

  setWindowTitle('ConnectHub');
  setWindowMinSize(const Size(900, 600));
  setWindowMaxSize(Size.infinite);
  setWindowFrame(const Rect.fromLTWH(100, 100, 1280, 800));
}
```

## Desktop keyboard shortcuts

```dart
// shared/widgets/desktop_shortcuts.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class DesktopShortcuts extends StatelessWidget {
  final Widget child;
  const DesktopShortcuts({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: {
        LogicalKeySet(LogicalKeyboardKey.control, LogicalKeyboardKey.keyK):
            const SearchIntent(),
        LogicalKeySet(LogicalKeyboardKey.control, LogicalKeyboardKey.keyN):
            const NewMessageIntent(),
        LogicalKeySet(LogicalKeyboardKey.escape):
            const DismissIntent(),
      },
      child: Actions(
        actions: {
          SearchIntent: CallbackAction<SearchIntent>(
            onInvoke: (_) => _openSearch(context),
          ),
        },
        child: child,
      ),
    );
  }

  void _openSearch(BuildContext context) {
    // Command palette ochish
  }
}

class SearchIntent extends Intent { const SearchIntent(); }
class NewMessageIntent extends Intent { const NewMessageIntent(); }
```

---

# 7. 📦 pubspec.yaml

```yaml
name: connecthub
description: ConnectHub — Social Platform
publish_to: none
version: 1.0.0+1

environment:
  sdk: '>=3.4.0 <4.0.0'
  flutter: '>=3.22.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5
  freezed_annotation: ^2.4.1

  # Navigation
  go_router: ^13.2.0

  # Adaptive UI
  flutter_adaptive_scaffold: ^0.2.0

  # Network
  dio: ^5.4.3
  retrofit: ^4.1.0
  socket_io_client: ^2.0.3+1

  # Storage
  flutter_secure_storage: ^9.2.2
  shared_preferences: ^2.3.2
  isar: ^3.1.0+1
  isar_flutter_libs: ^3.1.0+1
  sembast: ^3.6.0          # Web local DB
  sembast_web: ^2.4.0

  # WebRTC
  flutter_webrtc: ^0.10.7

  # Media
  image_picker: ^1.1.2
  file_picker: ^8.1.2
  video_player: ^2.9.1
  cached_network_image: ^3.3.1
  photo_view: ^0.15.0

  # Firebase (mobile)
  firebase_core: ^3.6.0
  firebase_messaging: ^15.1.3
  flutter_local_notifications: ^17.2.2

  # Web SEO
  flutter_meta_seo: ^2.0.0
  flutter_web_plugins:
    sdk: flutter

  # Desktop
  window_size:
    git:
      url: https://github.com/google/flutter-desktop-embedding
      path: plugins/window_size

  # UI
  lottie: ^3.1.2
  shimmer: ^3.0.0
  flutter_animate: ^4.5.0
  gap: ^3.0.1
  flex_color_scheme: ^8.0.2
  flutter_svg: ^2.0.10+1
  emoji_picker_flutter: ^2.2.0

  # Utils
  crypto: ^3.0.3
  connectivity_plus: ^6.1.0
  intl: ^0.19.0
  url_launcher: ^6.3.1
  share_plus: ^10.0.2
  sentry_flutter: ^8.8.0
  permission_handler: ^11.3.1
  pretty_dio_logger: ^1.3.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.13
  freezed: ^2.5.2
  riverpod_generator: ^2.4.3
  retrofit_generator: ^8.1.0
  isar_generator: ^3.1.0+1
  json_serializable: ^6.8.0
  flutter_lints: ^4.0.0

flutter:
  generate: true  # l10n
  uses-material-design: true

  assets:
    - assets/icons/
    - assets/images/
    - assets/animations/

  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter/Inter-Regular.ttf
        - asset: assets/fonts/Inter/Inter-Medium.ttf
          weight: 500
        - asset: assets/fonts/Inter/Inter-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Inter/Inter-Bold.ttf
          weight: 700
    - family: PlusJakartaSans
      fonts:
        - asset: assets/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold.ttf
          weight: 600
```

---

# 8. 🔌 Platform-aware Storage

```dart
// core/storage/local_db_service.dart
import 'package:flutter/foundation.dart';

abstract class LocalDbService {
  Future<void> init();
  Future<void> saveMessages(List<Map<String, dynamic>> messages, String chatId);
  Future<List<Map<String, dynamic>>> getMessages(String chatId);
  Future<void> clearAll();
}

// Mobile + Desktop: Isar
class IsarDbService implements LocalDbService { ... }

// Web: Sembast (IndexedDB)
class SembastDbService implements LocalDbService { ... }

// Factory
LocalDbService createLocalDb() {
  if (kIsWeb) return SembastDbService();
  return IsarDbService();
}
```

---

# 9. 🚀 go_router — Web URL Friendly

```dart
// core/router/app_router.dart
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_router.g.dart';

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  return GoRouter(
    initialLocation: '/feed',
    redirect: (context, state) => appRedirect(state, ref),
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),

      // Adaptive shell
      ShellRoute(
        builder: (_, __, child) => AdaptiveAppShell(
          child: child,
          selectedIndex: _indexFromPath(__.uri.path),
        ),
        routes: [
          GoRoute(path: '/feed', builder: (_, __) => const FeedScreen()),
          GoRoute(
            path: '/goals',
            builder: (_, __) => const GoalsScreen(),
            routes: [
              GoRoute(path: ':goalId', builder: (_, s) => GoalDetailScreen(goalId: s.pathParameters['goalId']!)),
            ],
          ),
          GoRoute(
            path: '/groups',
            builder: (_, __) => const GroupsScreen(),
            routes: [
              GoRoute(
                path: ':groupId',
                builder: (_, s) => GroupDetailScreen(groupId: s.pathParameters['groupId']!),
                routes: [
                  GoRoute(path: 'chat', builder: (_, s) => ChatScreen(
                    chatId: s.pathParameters['groupId']!, chatType: 'group',
                  )),
                ],
              ),
            ],
          ),
          GoRoute(path: '/channels', builder: (_, __) => const ChannelsScreen()),
          GoRoute(
            path: '/profile',
            builder: (_, __) => const ProfileScreen(),
            routes: [
              GoRoute(path: ':username', builder: (_, s) => PublicProfileScreen(
                username: s.pathParameters['username']!,
              )),
            ],
          ),
          GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
        ],
      ),
    ],
  );
}

int _indexFromPath(String path) {
  if (path.startsWith('/feed')) return 0;
  if (path.startsWith('/goals')) return 1;
  if (path.startsWith('/groups')) return 2;
  if (path.startsWith('/channels')) return 3;
  if (path.startsWith('/profile')) return 4;
  return 0;
}
```

---

# 10. 🌍 Lokalizatsiya (UZ / RU / EN)

```yaml
# l10n.yaml
arb-dir: lib/l10n
template-arb-file: app_uz.arb
output-localization-file: app_localizations.dart
```

---

# 11. 🔧 Platform Sozlamalar

## Web — index.html

```html
<!-- web/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ConnectHub — maqsadlar asosida odamlarni birlashtiruvchi ijtimoiy platforma">
  <meta property="og:title" content="ConnectHub">
  <meta property="og:description" content="Maqsadlaringizni ulashing, guruhlar toping, o'sib boring">
  <meta property="og:image" content="/assets/og-image.png">
  <meta property="og:url" content="https://connecthub.uz">
  <title>ConnectHub</title>
  <link rel="icon" href="favicon.png">
  <!-- Preconnect API -->
  <link rel="preconnect" href="https://api.connecthub.uz">
</head>
<body>
  <script src="flutter_bootstrap.js" async></script>
</body>
</html>
```

## macOS — Entitlements

```xml
<!-- macos/Runner/Release.entitlements -->
<dict>
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.network.server</key>
  <true/>
  <key>com.apple.security.device.audio-input</key>
  <true/>
  <key>com.apple.security.device.camera</key>
  <true/>
</dict>
```

---

# 12. 🚀 CI/CD — GitHub Actions

```yaml
# .github/workflows/multi_platform.yml
name: ConnectHub Multi-Platform Build

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.22.x' }
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter test

  build-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.22.x' }
      - run: flutter pub get && dart run build_runner build
      - run: flutter build web --web-renderer html --release
          --dart-define=API_URL=${{ secrets.API_URL }}
      - name: Deploy to server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: build/web
          target: /var/www/connecthub

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'zulu', java-version: '17' }
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.22.x' }
      - run: flutter pub get && dart run build_runner build
      - run: flutter build appbundle --release --flavor prod

  build-macos:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.22.x' }
      - run: flutter pub get && dart run build_runner build
      - run: flutter build macos --release

  build-windows:
    needs: test
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.22.x' }
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter build windows --release
```

---

# 13. ✅ Multi-Platform Developer Checklist

## Setup

- [ ]  Flutter 3.22.x stable o'rnatilgan
- [ ]  Web: `flutter config --enable-web`
- [ ]  Desktop: `flutter config --enable-macos-desktop --enable-windows-desktop --enable-linux-desktop`
- [ ]  `pubspec.yaml` — barcha paketlar
- [ ]  `build_runner` ishlaydi
- [ ]  `l10n.yaml` va `.arb` fayllar tayyor
- [ ]  Flavor'lar (dev/staging/prod) sozlangan

## Web

- [ ]  `usePathUrlStrategy()` — hash olib tashlangan
- [ ]  `index.html` — og: meta tags
- [ ]  `flutter_meta_seo` — dynamic meta tags
- [ ]  HTML renderer tanlangan (`--web-renderer html`)
- [ ]  Nginx prerendering sozlangan
- [ ]  Web: Sembast local DB ishlatilgan
- [ ]  Web: Browser Notification API
- [ ]  CORS backend da sozlangan
- [ ]  PWA manifest va service worker

## Mobile

- [ ]  Firebase ulangan (google-services.json, GoogleService-Info.plist)
- [ ]  FCM push notification
- [ ]  Biometrik (local_auth)
- [ ]  Android: AndroidManifest.xml ruxsatlar
- [ ]  iOS: Info.plist ruxsatlar
- [ ]  Deep link sozlangan

## Desktop

- [ ]  macOS: Entitlements (network, camera, microphone)
- [ ]  Windows: msix packaging
- [ ]  Desktop window o'lchami sozlangan (min: 900x600)
- [ ]  Keyboard shortcuts (Ctrl+K, Ctrl+N, Esc)
- [ ]  Desktop notifications
- [ ]  Drag & drop fayl yuklash

## Adaptive UI

- [ ]  `AdaptiveScaffold` — compact/medium/expanded
- [ ]  `LayoutBuilder` — breakpoint based widget
- [ ]  Mobile: BottomNavigationBar
- [ ]  Tablet/Web narrow: NavigationRail
- [ ]  Desktop/Web wide: NavigationDrawer
- [ ]  Chat: desktop da side-by-side layout
- [ ]  Font scaling test

## CI/CD

- [ ]  GitHub Actions — test
- [ ]  GitHub Actions — web build + deploy
- [ ]  GitHub Actions — Android appbundle
- [ ]  GitHub Actions — iOS ipa
- [ ]  GitHub Actions — macOS dmg
- [ ]  Sentry crash reporting

---

> 📌 **Muhim eslatmalar:**
> 

> - `dart run build_runner build` — freezed, riverpod, retrofit, isar uchun har doim
> 

> - Web da `kIsWeb` check bilan platform-specific kod ajratilinadi
> 

> - SEO: dinamik sahifalar uchun `SeoService.setMeta()` har sahifada `initState` da chaqiriladi
> 

> - Desktop: `configureDesktopWindow()` `main()` da eng birinchi chaqiriladi
> 

---

*ConnectHub Flutter Multi-Platform TZ | Flutter 3.22.x + Riverpod + AdaptiveScaffold | 2026-yil Iyun*