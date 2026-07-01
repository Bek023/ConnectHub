import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../comment_model.dart';
import '../post_detail_notifier.dart';
import 'comment_card.dart';

class CommentsSection extends ConsumerWidget {
  const CommentsSection({
    super.key,
    required this.postId,
    required this.currentUserId,
    required this.comments,
    required this.hasMore,
    required this.isLoading,
  });

  final String postId;
  final String currentUserId;
  final List<CommentModel> comments;
  final bool hasMore;
  final bool isLoading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space4,
            vertical: AppSpacing.space3,
          ),
          child: Text(
            'Izohlar (${comments.length})',
            style: AppTextStyles.labelLg.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
        if (isLoading && comments.isEmpty)
          const _CommentShimmer()
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.space4,
            ),
            itemCount: comments.length,
            separatorBuilder: (_, __) => Divider(
              height: 1,
              color: Theme.of(context).dividerColor,
            ),
            itemBuilder: (ctx, i) {
              final c = comments[i];
              return CommentCard(
                comment: c,
                isOwnComment: c.author.id == currentUserId,
                onDelete: () => ref
                    .read(postDetailProvider(postId).notifier)
                    .deleteComment(c.id),
              );
            },
          ),
        if (hasMore)
          Center(
            child: TextButton(
              onPressed: () => ref
                  .read(postDetailProvider(postId).notifier)
                  .loadMoreComments(),
              child: Text(
                'Ko\'proq ko\'rish',
                style: AppTextStyles.labelLg,
              ),
            ),
          ),
      ],
    );
  }
}

class _CommentShimmer extends StatelessWidget {
  const _CommentShimmer();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space4),
      child: AppShimmer(
        child: Column(
          children: List.generate(
            3,
            (_) => const Padding(
              padding: EdgeInsets.symmetric(vertical: AppSpacing.space3),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ShimmerCircle(size: 32),
                  SizedBox(width: AppSpacing.space3),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ShimmerBox(width: 100, height: 12),
                        SizedBox(height: 6),
                        ShimmerBox(width: double.infinity, height: 14),
                        SizedBox(height: 4),
                        ShimmerBox(width: 200, height: 14),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
