import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_text_styles.dart';

enum AppButtonVariant { primary, outlined, text }

enum AppButtonSize { sm, md, lg }

class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.md,
    this.loading = false,
    this.icon,
    this.fullWidth = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool loading;
  final Widget? icon;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    final height = switch (size) {
      AppButtonSize.sm => 36.0,
      AppButtonSize.md => 48.0,
      AppButtonSize.lg => 56.0,
    };

    final textStyle = switch (size) {
      AppButtonSize.sm => AppTextStyles.labelSm,
      AppButtonSize.md => AppTextStyles.labelLg,
      AppButtonSize.lg => AppTextStyles.labelLg,
    };

    final child = loading
        ? SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: variant == AppButtonVariant.primary
                  ? AppColors.white
                  : AppColors.primary,
            ),
          )
        : icon != null
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  icon!,
                  const SizedBox(width: AppSpacing.space2),
                  Text(label, style: textStyle),
                ],
              )
            : Text(label, style: textStyle);

    final minSize = fullWidth
        ? Size(double.infinity, height)
        : Size(0, height);

    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.sm),
    );

    return switch (variant) {
      AppButtonVariant.primary => ElevatedButton(
          onPressed: loading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.white,
            minimumSize: minSize,
            shape: shape,
            elevation: 0,
          ),
          child: child,
        ),
      AppButtonVariant.outlined => OutlinedButton(
          onPressed: loading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.primary,
            side: const BorderSide(color: AppColors.primary),
            minimumSize: minSize,
            shape: shape,
          ),
          child: child,
        ),
      AppButtonVariant.text => TextButton(
          onPressed: loading ? null : onPressed,
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            minimumSize: minSize,
            shape: shape,
          ),
          child: child,
        ),
    };
  }
}
