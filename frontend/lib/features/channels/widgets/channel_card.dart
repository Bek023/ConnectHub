import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_card.dart';
import '../channel_model.dart';

class ChannelCard extends StatelessWidget {
  const ChannelCard({
    super.key,
    required this.channel,
    required this.onTap,
    required this.onSubscribe,
  });

  final ChannelModel channel;
  final VoidCallback onTap;
  final VoidCallback onSubscribe;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.space4),
      margin: const EdgeInsets.only(bottom: AppSpacing.space3),
      child: Row(
        children: [
          AppAvatar(
            imageUrl: channel.avatarUrl,
            name: channel.name,
            size: AppAvatarSize.md,
          ),
          const SizedBox(width: AppSpacing.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        channel.name,
                        style: AppTextStyles.labelLg.copyWith(
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (channel.isOwner) ...[
                      const SizedBox(width: AppSpacing.space2),
                      _OwnerBadge(),
                    ],
                  ],
                ),
                if (channel.description != null &&
                    channel.description!.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    channel.description!,
                    style: AppTextStyles.bodySm,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.person_outline,
                        size: 14, color: AppColors.neutral400),
                    const SizedBox(width: 4),
                    Text(
                      _formatCount(channel.subscribersCount),
                      style: AppTextStyles.bodySm,
                    ),
                    if (channel.category != null) ...[
                      const SizedBox(width: AppSpacing.space3),
                      _CategoryChip(category: channel.category!),
                    ],
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.space3),
          AppButton(
            label: channel.isSubscribed ? 'Obuna' : 'Obuna bo\'l',
            variant: channel.isSubscribed
                ? AppButtonVariant.outlined
                : AppButtonVariant.primary,
            size: AppButtonSize.sm,
            onPressed: onSubscribe,
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

class _OwnerBadge extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.accentOrange.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        'Admin',
        style: AppTextStyles.bodySm.copyWith(
          color: AppColors.accentOrange,
          fontSize: 10,
        ),
      ),
    );
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
