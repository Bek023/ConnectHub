import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_text_styles.dart';
import 'app_button.dart';

class AppErrorState extends StatelessWidget {
  const AppErrorState({
    super.key,
    this.message,
    this.onRetry,
  });

  final String? message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: AppColors.error,
            ),
            const SizedBox(height: AppSpacing.space5),
            Text(
              message ?? 'Xato yuz berdi',
              style: AppTextStyles.heading3.copyWith(
                color: Theme.of(context).colorScheme.onSurface,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.space2),
            Text(
              'Qayta urinib ko\'ring',
              style: AppTextStyles.bodyMd.copyWith(
                color: AppColors.neutral400,
              ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: AppSpacing.space6),
              AppButton(
                label: 'Qayta urinish',
                onPressed: onRetry,
                fullWidth: false,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
