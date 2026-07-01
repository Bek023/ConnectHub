import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Type scale.
/// Manba: Figma Dizayn TZ — bo'lim 3 (Tipografiya).
/// Sarlavhalar: Plus Jakarta Sans (700/600). Asosiy matn: Inter (400/500).
/// Kod/Monospace: JetBrains Mono (400).
abstract class AppTextStyles {
  static const _heading = 'PlusJakartaSans';
  static const _body = 'Inter';
  static const _mono = 'JetBrainsMono';

  static const displayXl = TextStyle(
    fontFamily: _heading,
    fontSize: 48,
    height: 56 / 48,
    fontWeight: FontWeight.w700,
  );

  static const displayLg = TextStyle(
    fontFamily: _heading,
    fontSize: 36,
    height: 44 / 36,
    fontWeight: FontWeight.w700,
  );

  static const heading1 = TextStyle(
    fontFamily: _heading,
    fontSize: 28,
    height: 36 / 28,
    fontWeight: FontWeight.w700,
  );

  static const heading2 = TextStyle(
    fontFamily: _heading,
    fontSize: 22,
    height: 30 / 22,
    fontWeight: FontWeight.w600,
  );

  static const heading3 = TextStyle(
    fontFamily: _heading,
    fontSize: 18,
    height: 26 / 18,
    fontWeight: FontWeight.w600,
  );

  static const bodyLg = TextStyle(
    fontFamily: _body,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w400,
  );

  static const bodyMd = TextStyle(
    fontFamily: _body,
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w400,
  );

  static const bodySm = TextStyle(
    fontFamily: _body,
    fontSize: 12,
    height: 18 / 12,
    fontWeight: FontWeight.w400,
  );

  static const labelLg = TextStyle(
    fontFamily: _body,
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w500,
  );

  static const labelSm = TextStyle(
    fontFamily: _body,
    fontSize: 12,
    height: 16 / 12,
    fontWeight: FontWeight.w500,
  );

  static const mono = TextStyle(
    fontFamily: _mono,
    fontSize: 13,
    height: 20 / 13,
    fontWeight: FontWeight.w400,
  );

  /// Berilgan rangga moslab nusxa olish uchun yordamchi.
  static TextStyle onColor(TextStyle base, Color color) =>
      base.copyWith(color: color);

  // Tez-tez ishlatiladigan kombinatsiyalar
  static final heading2Dark = heading2.copyWith(color: AppColors.darkTextPrimary);
  static final bodySmMuted = bodySm.copyWith(color: AppColors.neutral400);
  static final bodySmError = bodySm.copyWith(color: AppColors.error);
}
