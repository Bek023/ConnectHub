import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_card.dart';
import '../group_model.dart';

class GroupCard extends StatelessWidget {
  const GroupCard({
    super.key,
    required this.group,
    required this.onTap,
  });

  final GroupModel group;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.space4),
      margin: const EdgeInsets.only(bottom: AppSpacing.space3),
      child: Row(
        children: [
          AppAvatar(
            imageUrl: group.avatarUrl,
            name: group.title,
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
                        group.title,
                        style: AppTextStyles.labelLg.copyWith(
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.space2),
                    _TypeBadge(type: group.type),
                  ],
                ),
                if (group.description != null &&
                    group.description!.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    group.description!,
                    style: AppTextStyles.bodySm,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.people_outline,
                        size: 14, color: AppColors.neutral400),
                    const SizedBox(width: 4),
                    Text(
                      '${group.membersCount} a\'zo',
                      style: AppTextStyles.bodySm,
                    ),
                    if (group.myRole != null) ...[
                      const SizedBox(width: AppSpacing.space3),
                      _RoleBadge(role: group.myRole!),
                    ],
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.space2),
          const Icon(
            Icons.chevron_right,
            color: AppColors.neutral400,
          ),
        ],
      ),
    );
  }
}

class _TypeBadge extends StatelessWidget {
  const _TypeBadge({required this.type});
  final String type;

  @override
  Widget build(BuildContext context) {
    final isPrivate = type == 'private';
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          isPrivate ? Icons.lock_outline : Icons.public,
          size: 13,
          color: AppColors.neutral400,
        ),
      ],
    );
  }
}

class _RoleBadge extends StatelessWidget {
  const _RoleBadge({required this.role});
  final String role;

  @override
  Widget build(BuildContext context) {
    if (role == 'member') return const SizedBox.shrink();
    final color = role == 'owner' ? AppColors.accentOrange : AppColors.info;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        role == 'owner' ? 'Asoschı' : 'Admin',
        style: AppTextStyles.bodySm.copyWith(color: color, fontSize: 10),
      ),
    );
  }
}
