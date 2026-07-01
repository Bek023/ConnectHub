import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space6),
          child: Column(
            children: [
              const Spacer(flex: 2),
              _buildLogo(),
              const SizedBox(height: AppSpacing.space8),
              _buildTexts(context),
              const Spacer(flex: 3),
              _buildButtons(context),
              const SizedBox(height: AppSpacing.space8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Container(
      width: 96,
      height: 96,
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      child: const Icon(
        Icons.hub_outlined,
        size: 48,
        color: AppColors.white,
      ),
    );
  }

  Widget _buildTexts(BuildContext context) {
    return Column(
      children: [
        Text(
          'ConnectHub',
          style: AppTextStyles.displayLg.copyWith(
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: AppSpacing.space3),
        Text(
          'Maqsadlaringizni ulashing,\nguruhlar toping, o\'sib boring',
          style: AppTextStyles.bodyLg.copyWith(color: AppColors.neutral400),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildButtons(BuildContext context) {
    return Column(
      children: [
        AppButton(
          label: 'Kirish',
          onPressed: () => context.push(AppRoutes.login),
        ),
        const SizedBox(height: AppSpacing.space3),
        AppButton(
          label: 'Ro\'yxatdan o\'tish',
          onPressed: () => context.push(AppRoutes.register),
          variant: AppButtonVariant.outlined,
        ),
      ],
    );
  }
}
