import 'package:flutter/material.dart';

/// ConnectHub rang tizimi.
/// Manba: Figma Dizayn TZ — bo'lim 2 (Rang Tizimi).
/// Dark mode — asosiy tema, Light mode — ikkilamchi.
abstract class AppColors {
  // ---- Brand (Primary) ----
  static const primary = Color(0xFF6C63FF);
  static const primaryDark = Color(0xFF4B44CC);
  static const primaryLight = Color(0xFFA59EFF);
  static const primaryPale = Color(0xFFEEF0FF);

  // ---- Secondary / Accent ----
  static const accentGreen = Color(0xFF22C55E); // online, success
  static const accentOrange = Color(0xFFF97316); // warning, badge
  static const accentPink = Color(0xFFEC4899); // love reaction
  static const accentTeal = Color(0xFF14B8A6); // goals tag, verified

  // ---- Neutral scale ----
  static const neutral950 = Color(0xFF0A0A0F);
  static const neutral900 = Color(0xFF111118);
  static const neutral800 = Color(0xFF1C1C28);
  static const neutral700 = Color(0xFF2D2D3F);
  static const neutral600 = Color(0xFF4A4A65);
  static const neutral400 = Color(0xFF9494AD);
  static const neutral200 = Color(0xFFE2E2EE);
  static const neutral100 = Color(0xFFF4F4FA);
  static const neutral50 = Color(0xFFFAFAFF);
  static const white = Color(0xFFFFFFFF);

  // ---- Semantic ----
  static const success = Color(0xFF16A34A);
  static const error = Color(0xFFDC2626);
  static const warning = Color(0xFFD97706);
  static const info = Color(0xFF2563EB);

  // ---- Theme tokens: Light ----
  static const lightBackground = neutral50;
  static const lightSurface = white;
  static const lightTextPrimary = Color(0xFF111118);
  static const lightTextSecondary = Color(0xFF4A4A65);
  static const lightBorder = neutral200;

  // ---- Theme tokens: Dark (default) ----
  static const darkBackground = neutral950;
  static const darkSurface = neutral800;
  static const darkTextPrimary = white;
  static const darkTextSecondary = neutral400;
  static const darkBorder = neutral700;
}
