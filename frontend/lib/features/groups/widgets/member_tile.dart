import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../group_model.dart';

class MemberTile extends StatelessWidget {
  const MemberTile({
    super.key,
    required this.member,
    required this.canManage,
    required this.onRoleChange,
    required this.onRemove,
  });

  final GroupMemberModel member;
  final bool canManage;
  final void Function(String role) onRoleChange;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space4,
        vertical: AppSpacing.space1,
      ),
      leading: AppAvatar(
        imageUrl: member.avatarUrl,
        name: member.displayName,
        size: AppAvatarSize.sm,
      ),
      title: Row(
        children: [
          Text(
            member.displayName,
            style: AppTextStyles.labelLg.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          const SizedBox(width: AppSpacing.space2),
          _RoleBadge(role: member.role),
        ],
      ),
      subtitle: member.username != null
          ? Text('@${member.username}', style: AppTextStyles.bodySm)
          : null,
      trailing: canManage && member.role != 'owner'
          ? PopupMenuButton<String>(
              icon: const Icon(Icons.more_vert, size: 20),
              onSelected: (v) {
                if (v == 'remove') {
                  onRemove();
                } else {
                  onRoleChange(v);
                }
              },
              itemBuilder: (_) => [
                if (member.role != 'admin')
                  const PopupMenuItem(
                    value: 'admin',
                    child: Text('Admin qilish'),
                  ),
                if (member.role == 'admin')
                  const PopupMenuItem(
                    value: 'member',
                    child: Text('Admin olib tashlash'),
                  ),
                const PopupMenuDivider(),
                const PopupMenuItem(
                  value: 'remove',
                  child: Text('Guruhdan chiqarish'),
                ),
              ],
            )
          : null,
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
