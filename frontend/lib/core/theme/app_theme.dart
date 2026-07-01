import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_spacing.dart';
import 'app_text_styles.dart';

/// ConnectHub ThemeData — Light va Dark.
/// Dark mode TZ bo'yicha standart (default) tema.
abstract class AppTheme {
  static ThemeData get dark => _build(
        brightness: Brightness.dark,
        background: AppColors.darkBackground,
        surface: AppColors.darkSurface,
        textPrimary: AppColors.darkTextPrimary,
        textSecondary: AppColors.darkTextSecondary,
        border: AppColors.darkBorder,
      );

  static ThemeData get light => _build(
        brightness: Brightness.light,
        background: AppColors.lightBackground,
        surface: AppColors.lightSurface,
        textPrimary: AppColors.lightTextPrimary,
        textSecondary: AppColors.lightTextSecondary,
        border: AppColors.lightBorder,
      );

  static ThemeData _build({
    required Brightness brightness,
    required Color background,
    required Color surface,
    required Color textPrimary,
    required Color textSecondary,
    required Color border,
  }) {
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: AppColors.primary,
      onPrimary: AppColors.white,
      secondary: AppColors.accentTeal,
      onSecondary: AppColors.white,
      error: AppColors.error,
      onError: AppColors.white,
      surface: surface,
      onSurface: textPrimary,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      dividerColor: border,
      fontFamily: 'Inter',
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayXl.copyWith(color: textPrimary),
        displayMedium: AppTextStyles.displayLg.copyWith(color: textPrimary),
        headlineLarge: AppTextStyles.heading1.copyWith(color: textPrimary),
        headlineMedium: AppTextStyles.heading2.copyWith(color: textPrimary),
        headlineSmall: AppTextStyles.heading3.copyWith(color: textPrimary),
        bodyLarge: AppTextStyles.bodyLg.copyWith(color: textPrimary),
        bodyMedium: AppTextStyles.bodyMd.copyWith(color: textSecondary),
        bodySmall: AppTextStyles.bodySm.copyWith(color: textSecondary),
        labelLarge: AppTextStyles.labelLg.copyWith(color: textPrimary),
        labelSmall: AppTextStyles.labelSm.copyWith(color: textSecondary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space4,
          vertical: AppSpacing.space3,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.sm),
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.sm),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.sm),
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.white,
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary),
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: textSecondary,
      ),
    );
  }
}
