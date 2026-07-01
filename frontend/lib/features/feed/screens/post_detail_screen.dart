import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../../auth/auth_notifier.dart';
import '../feed_notifier.dart';
import '../post_detail_notifier.dart';
import '../widgets/comments_section.dart';
import '../widgets/post_actions_bar.dart';
import '../widgets/post_header.dart';
import '../widgets/post_media.dart';

class PostDetailScreen extends ConsumerStatefulWidget {
  const PostDetailScreen({super.key, required this.postId});

  final String postId;

  @override
  ConsumerState<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends ConsumerState<PostDetailScreen> {
  final _controller = TextEditingController();
  bool _sending = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _sendComment() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() => _sending = true);
    try {
      await ref
          .read(postDetailProvider(widget.postId).notifier)
          .addComment(text);
      _controller.clear();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final detailState = ref.watch(postDetailProvider(widget.postId));
    final currentUserId =
        ref.watch(authProvider).valueOrNull?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Post'),
        actions: [
          if (detailState.valueOrNull != null)
            PopupMenuButton<String>(
              onSelected: (v) async {
                if (v == 'pin') {
                  await ref
                      .read(postDetailProvider(widget.postId).notifier)
                      .togglePin();
                } else if (v == 'share') {
                  Share.share(detailState.valueOrNull!.post.content);
                }
              },
              itemBuilder: (_) => [
                PopupMenuItem(
                  value: 'pin',
                  child: Text(
                    detailState.valueOrNull!.post.isPinned
                        ? 'Mahkamlashni bekor qilish'
                        : 'Mahkamlash',
                  ),
                ),
                const PopupMenuItem(
                  value: 'share',
                  child: Text('Ulashish'),
                ),
              ],
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: detailState.when(
              data: (data) => CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.space4),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          PostHeader(
                            author: data.post.author,
                            createdAt: data.post.createdAt,
                          ),
                          const SizedBox(height: AppSpacing.space3),
                          Text(
                            data.post.content,
                            style: AppTextStyles.bodyLg.copyWith(
                              color:
                                  Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          if (data.post.mediaUrls.isNotEmpty) ...[
                            const SizedBox(height: AppSpacing.space3),
                            PostMedia(urls: data.post.mediaUrls),
                          ],
                          const SizedBox(height: AppSpacing.space3),
                          Divider(
                            color: Theme.of(context).dividerColor,
                            height: 1,
                          ),
                          const SizedBox(height: AppSpacing.space2),
                          PostActionsBar(
                            likesCount: data.post.likesCount,
                            commentsCount: data.post.commentsCount,
                            isLiked: data.post.isLiked,
                            onLike: () => ref
                                .read(feedProvider.notifier)
                                .toggleLike(data.post.id),
                            onComment: () {},
                            onShare: () => Share.share(data.post.content),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: CommentsSection(
                      postId: widget.postId,
                      currentUserId: currentUserId,
                      comments: data.comments,
                      hasMore: data.hasMoreComments,
                      isLoading: false,
                    ),
                  ),
                  const SliverToBoxAdapter(
                    child: SizedBox(height: AppSpacing.space6),
                  ),
                ],
              ),
              loading: () => const _DetailShimmer(),
              error: (e, _) => AppErrorState(
                message: e.toString().replaceFirst('Exception: ', ''),
                onRetry: () => ref.invalidate(postDetailProvider(widget.postId)),
              ),
            ),
          ),
          const Divider(height: 1),
          _CommentInput(
            controller: _controller,
            sending: _sending,
            onSend: _sendComment,
          ),
        ],
      ),
    );
  }
}

class _CommentInput extends StatelessWidget {
  const _CommentInput({
    required this.controller,
    required this.sending,
    required this.onSend,
  });

  final TextEditingController controller;
  final bool sending;
  final VoidCallback onSend;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space3,
          vertical: AppSpacing.space2,
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                textCapitalization: TextCapitalization.sentences,
                decoration: InputDecoration(
                  hintText: 'Izoh qoldiring...',
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.space4,
                    vertical: AppSpacing.space2,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: Theme.of(context).dividerColor,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2),
            IconButton(
              onPressed: sending ? null : onSend,
              icon: sending
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.send),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailShimmer extends StatelessWidget {
  const _DetailShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Row(
              children: [
                ShimmerCircle(size: 40),
                SizedBox(width: AppSpacing.space3),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  ShimmerBox(width: 120, height: 14),
                  SizedBox(height: 4),
                  ShimmerBox(width: 80, height: 12),
                ]),
              ],
            ),
            SizedBox(height: AppSpacing.space4),
            ShimmerBox(width: double.infinity, height: 16),
            SizedBox(height: 6),
            ShimmerBox(width: double.infinity, height: 16),
            SizedBox(height: 6),
            ShimmerBox(width: 180, height: 16),
          ],
        ),
      ),
    );
  }
}
