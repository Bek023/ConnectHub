import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../notification_model.dart';

class NotificationTile extends StatelessWidget {
  const NotificationTile({
    super.key,
    required this.notification,
    required this.onTap,
    required this.onDelete,
  });

  final NotificationModel notification;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isUnread = !notification.isRead;

    return Dismissible(
      key: ValueKey(notification.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => onDelete(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: AppSpacing.space4),
        color: AppColors.error,
        child: const Icon(Icons.delete_outline, color: Colors.white),
      ),
      child: InkWell(
        onTap: onTap,
        child: Container(
          color: isUnread
              ? AppColors.primary.withValues(alpha: 0.06)
              : Colors.transparent,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space4,
            vertical: AppSpacing.space3,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  AppAvatar(
                    imageUrl: notification.senderAvatarUrl,
                    name: notification.senderName ?? '?',
                    size: AppAvatarSize.md,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: scheme.surface,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _iconForType(notification.type),
                        size: 12,
                        color: _colorForType(notification.type),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notification.title,
                      style: AppTextStyles.labelLg.copyWith(
                        color: scheme.onSurface,
                        fontWeight: isUnread
                            ? FontWeight.w600
                            : FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      notification.body,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.bodyMd.copyWith(
                        color: AppColors.neutral400,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _formatTime(notification.createdAt),
                      style: AppTextStyles.bodySm.copyWith(
                        color: AppColors.neutral400,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              if (isUnread)
                Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.only(top: 4, left: AppSpacing.space2),
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _iconForType(String type) {
    switch (type) {
      case 'message':
        return Icons.chat_bubble_outline_rounded;
      case 'like':
        return Icons.favorite_rounded;
      case 'comment':
        return Icons.comment_outlined;
      case 'new_member':
        return Icons.person_add_outlined;
      case 'call':
        return Icons.call_outlined;
      case 'mention':
        return Icons.alternate_email_rounded;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _colorForType(String type) {
    switch (type) {
      case 'message':
        return AppColors.primary;
      case 'like':
        return AppColors.accentPink;
      case 'comment':
        return AppColors.accentTeal;
      case 'call':
        return AppColors.accentGreen;
      default:
        return AppColors.accentOrange;
    }
  }

  String _formatTime(String createdAt) {
    try {
      final dt = DateTime.parse(createdAt).toLocal();
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 1) return 'Hozir';
      if (diff.inHours < 1) return '${diff.inMinutes}d oldin';
      if (diff.inDays < 1) return '${diff.inHours}s oldin';
      if (diff.inDays < 7) return '${diff.inDays}k oldin';
      return DateFormat('dd.MM.yyyy').format(dt);
    } catch (_) {
      return '';
    }
  }
}
