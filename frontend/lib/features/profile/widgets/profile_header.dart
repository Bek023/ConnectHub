import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../profile_model.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({
    super.key,
    required this.profile,
    required this.isOwn,
    this.onEdit,
    this.onMessage,
  });

  final ProfileModel profile;
  final bool isOwn;
  final VoidCallback? onEdit;
  final VoidCallback? onMessage;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppAvatar(
                imageUrl: profile.avatarUrl,
                name: profile.displayName,
                size: AppAvatarSize.xl,
              ),
              const SizedBox(width: AppSpacing.space5),
              Expanded(
                child: _StatsRow(profile: profile),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space3),
          Row(
            children: [
              Text(
                profile.displayName,
                style: AppTextStyles.heading3.copyWith(
                  color: scheme.onSurface,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (profile.isVerified) ...[
                const SizedBox(width: 4),
                const Icon(
                  Icons.verified_rounded,
                  size: 16,
                  color: AppColors.accentTeal,
                ),
              ],
            ],
          ),
          if (profile.username != null)
            Text(
              '@${profile.username}',
              style: AppTextStyles.bodyMd.copyWith(
                color: AppColors.neutral400,
              ),
            ),
          if (profile.bio != null && profile.bio!.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space2),
            Text(
              profile.bio!,
              style: AppTextStyles.bodyMd.copyWith(
                color: scheme.onSurface.withValues(alpha: 0.8),
              ),
            ),
          ],
          const SizedBox(height: AppSpacing.space4),
          if (isOwn)
            AppButton(
              label: 'Profilni tahrirlash',
              variant: AppButtonVariant.outlined,
              onPressed: onEdit,
            )
          else
            Row(
              children: [
                if (onMessage != null)
                  Expanded(
                    child: AppButton(
                      label: 'Xabar',
                      variant: AppButtonVariant.outlined,
                      onPressed: onMessage,
                    ),
                  ),
              ],
            ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  const _StatsRow({required this.profile});

  final ProfileModel profile;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _StatItem(label: 'Post', value: profile.postsCount),
        _StatItem(label: 'Maqsad', value: profile.goalsCount),
        _StatItem(label: 'Guruh', value: profile.groupsCount),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({required this.label, required this.value});

  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        Text(
          _formatCount(value),
          style: AppTextStyles.heading3.copyWith(
            color: scheme.onSurface,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(
          label,
          style: AppTextStyles.bodySm.copyWith(
            color: AppColors.neutral400,
          ),
        ),
      ],
    );
  }

  String _formatCount(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }
}
