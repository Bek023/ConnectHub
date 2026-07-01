/// Spacing va radius tokenlari.
/// Manba: Figma Dizayn TZ — bo'lim 4 (Spacing va Grid Tizimi).
abstract class AppSpacing {
  static const space1 = 4.0; // micro gap
  static const space2 = 8.0; // element ichki padding
  static const space3 = 12.0; // komponent gap
  static const space4 = 16.0; // card padding
  static const space5 = 20.0; // section gap
  static const space6 = 24.0; // card gap
  static const space8 = 32.0; // section padding
  static const space10 = 40.0; // large padding
  static const space12 = 48.0; // page padding
  static const space16 = 64.0; // hero padding
}

abstract class AppRadius {
  static const sm = 6.0; // input, small card
  static const md = 10.0; // card, modal
  static const lg = 16.0; // bottom sheet, large card
  static const xl = 24.0; // floating panel
  static const full = 9999.0; // avatar, badge, pill button
}

/// Breakpoint tizimi — Flutter Multi-Platform TZ bo'lim 4.
abstract class AppBreakpoints {
  static const compactMax = 600.0; // Mobile: BottomNavigationBar
  static const mediumMax = 840.0; // Tablet/Web: NavigationRail
  // > mediumMax => Desktop/Web: NavigationDrawer + side panel
}
