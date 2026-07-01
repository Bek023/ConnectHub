import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_card.dart';
import '../post_model.dart';
import 'post_actions_bar.dart';
import 'post_header.dart';
import 'post_media.dart';

class PostCard extends StatelessWidget {
  const PostCard({
    super.key,
    required this.post,
    required this.onLike,
    required this.onComment,
    required this.onShare,
  });

  final PostModel post;
  final VoidCallback onLike;
  final VoidCallback onComment;
  final VoidCallback onShare;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.space4),
      margin: const EdgeInsets.only(bottom: AppSpacing.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PostHeader(author: post.author, createdAt: post.createdAt),
          if (post.isPinned) ...[
            const SizedBox(height: AppSpacing.space2),
            _PinnedLabel(),
          ],
          const SizedBox(height: AppSpacing.space3),
          Text(
            post.content,
            style: AppTextStyles.bodyLg.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          if (post.mediaUrls.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space3),
            PostMedia(urls: post.mediaUrls),
          ],
          const SizedBox(height: AppSpacing.space3),
          Divider(color: Theme.of(context).dividerColor, height: 1),
          const SizedBox(height: AppSpacing.space2),
          PostActionsBar(
            likesCount: post.likesCount,
            commentsCount: post.commentsCount,
            isLiked: post.isLiked,
            onLike: onLike,
            onComment: onComment,
            onShare: onShare,
          ),
        ],
      ),
    );
  }
}

class _PinnedLabel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.push_pin, size: 14, color: AppColors.neutral400),
        const SizedBox(width: 4),
        Text(
          'Mahkamlangan',
          style: AppTextStyles.bodySm.copyWith(color: AppColors.neutral400),
        ),
      ],
    );
  }
}
