import 'package:flutter/material.dart';
import 'package:flutter_adaptive_scaffold/flutter_adaptive_scaffold.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/app_routes.dart';

/// Compact (mobile) / Medium (tablet) / Expanded (desktop) breakpoint'lariga
/// moslashuvchi asosiy ilova qobig'i.
/// Manba: Flutter Multi-Platform TZ > bo'lim 4 (Adaptive UI).
class AdaptiveAppShell extends StatelessWidget {
  const AdaptiveAppShell({
    super.key,
    required this.child,
    required this.selectedIndex,
  });

  final Widget child;
  final int selectedIndex;

  static const _destinations = [
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Feed',
    ),
    NavigationDestination(
      icon: Icon(Icons.flag_outlined),
      selectedIcon: Icon(Icons.flag),
      label: 'Maqsadlar',
    ),
    NavigationDestination(
      icon: Icon(Icons.group_outlined),
      selectedIcon: Icon(Icons.group),
      label: 'Guruhlar',
    ),
    NavigationDestination(
      icon: Icon(Icons.campaign_outlined),
      selectedIcon: Icon(Icons.campaign),
      label: 'Kanallar',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: 'Profil',
    ),
  ];

  void _onDestinationSelected(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go(AppRoutes.feed);
      case 1:
        context.go(AppRoutes.goals);
      case 2:
        context.go(AppRoutes.groups);
      case 3:
        context.go(AppRoutes.channels);
      case 4:
        context.go(AppRoutes.profile);
    }
  }

  /// `/feed`, `/goals`, ... yo'llaridan tab indeksini chiqaradi.
  static int indexFromPath(String path) {
    if (path.startsWith(AppRoutes.feed)) return 0;
    if (path.startsWith(AppRoutes.goals)) return 1;
    if (path.startsWith(AppRoutes.groups)) return 2;
    if (path.startsWith(AppRoutes.channels)) return 3;
    if (path.startsWith(AppRoutes.profile)) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return AdaptiveScaffold(
      selectedIndex: selectedIndex,
      onSelectedIndexChange: (i) => _onDestinationSelected(context, i),
      destinations: _destinations,
      body: (_) => child,
      // Desktop/Web (Expanded): chat preview yon panel.
      // TODO: ChatPreviewPanel features/chat yozilganda ulanadi.
      secondaryBody:
          Breakpoints.mediumAndUp.isActive(context) ? (_) => const SizedBox.shrink() : null,
    );
  }
}
