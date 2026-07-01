import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_card.dart';
import '../goal_model.dart';

class GoalCard extends StatelessWidget {
  const GoalCard({
    super.key,
    required this.goal,
    required this.onTap,
    required this.onJoin,
  });

  final GoalModel goal;
  final VoidCallback onTap;
  final VoidCallback onJoin;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.space4),
      margin: const EdgeInsets.only(bottom: AppSpacing.space3),
      child: Row(
        children: [
          _CategoryIcon(category: goal.category),
          const SizedBox(width: AppSpacing.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  goal.title,
                  style: AppTextStyles.labelLg.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.people_outline, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      _formatCount(goal.membersCount),
                      style: AppTextStyles.bodySm,
                    ),
                    const SizedBox(width: AppSpacing.space3),
                    _CategoryChip(category: goal.category),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.space3),
          AppButton(
            label: goal.isJoined ? 'Qo\'shilgan' : 'Qo\'shilish',
            variant: goal.isJoined
                ? AppButtonVariant.outlined
                : AppButtonVariant.primary,
            size: AppButtonSize.sm,
            onPressed: onJoin,
          ),
        ],
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000000) return '${(count / 1000000).toStringAsFixed(1)}M';
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return '$count';
  }
}

class _CategoryIcon extends StatelessWidget {
  const _CategoryIcon({required this.category});
  final String category;

  @override
  Widget build(BuildContext context) {
    final (icon, color) = _iconFor(category);
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Icon(icon, color: color, size: 28),
    );
  }

  (IconData, Color) _iconFor(String cat) {
    return switch (cat.toLowerCase()) {
      'fitness' || 'sport' => (Icons.fitness_center, AppColors.accentGreen),
      'learning' || 'education' => (Icons.school, AppColors.primary),
      'career' || 'work' => (Icons.work_outline, AppColors.info),
      'creativity' || 'art' => (Icons.palette_outlined, AppColors.accentPink),
      'health' => (Icons.favorite_outline, const Color(0xFFEF4444)),
      'finance' => (Icons.account_balance_wallet_outlined, AppColors.accentGreen),
      'social' => (Icons.people_outline, AppColors.info),
      'mindfulness' || 'meditation' => (Icons.self_improvement, AppColors.accentTeal),
      'travel' => (Icons.flight_outlined, AppColors.accentOrange),
      'cooking' || 'food' => (Icons.restaurant_outlined, AppColors.accentOrange),
      'reading' => (Icons.menu_book_outlined, AppColors.primary),
      _ => (Icons.flag_outlined, AppColors.neutral400),
    };
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({required this.category});
  final String category;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: Theme.of(context).dividerColor,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(category, style: AppTextStyles.bodySm),
    );
  }
}
