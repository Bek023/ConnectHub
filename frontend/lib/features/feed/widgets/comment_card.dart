import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../comment_model.dart';

class CommentCard extends StatelessWidget {
  const CommentCard({
    super.key,
    required this.comment,
    required this.isOwnComment,
    required this.onDelete,
  });

  final CommentModel comment;
  final bool isOwnComment;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppAvatar(
            imageUrl: comment.author.avatarUrl,
            name: comment.author.displayName,
            size: AppAvatarSize.xs,
          ),
          const SizedBox(width: AppSpacing.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      comment.author.displayName,
                      style: AppTextStyles.labelLg.copyWith(
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      _timeAgo(comment.createdAt),
                      style: AppTextStyles.bodySm,
                    ),
                    if (isOwnComment) ...[
                      const SizedBox(width: AppSpacing.space2),
                      GestureDetector(
                        onTap: onDelete,
                        child: Icon(
                          Icons.delete_outline,
                          size: 16,
                          color: Theme.of(context)
                              .colorScheme
                              .error
                              .withValues(alpha: 0.7),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  comment.content,
                  style: AppTextStyles.bodyMd.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withValues(alpha: 0.85),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _timeAgo(String iso) {
    try {
      final date = DateTime.parse(iso).toLocal();
      final diff = DateTime.now().difference(date);
      if (diff.inSeconds < 60) return 'Hozir';
      if (diff.inMinutes < 60) return '${diff.inMinutes} daq';
      if (diff.inHours < 24) return '${diff.inHours} soat';
      if (diff.inDays < 7) return '${diff.inDays} kun';
      return '${(diff.inDays / 7).floor()} hafta';
    } catch (_) {
      return '';
    }
  }
}
