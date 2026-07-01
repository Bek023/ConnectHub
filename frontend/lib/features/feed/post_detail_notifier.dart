import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'comment_model.dart';
import 'post_model.dart';
import 'post_repository.dart';

part 'post_detail_notifier.g.dart';

class PostDetailState {
  const PostDetailState({
    required this.post,
    this.comments = const [],
    this.nextCursor,
    this.hasMoreComments = false,
  });

  final PostModel post;
  final List<CommentModel> comments;
  final String? nextCursor;
  final bool hasMoreComments;

  PostDetailState copyWith({
    PostModel? post,
    List<CommentModel>? comments,
    Object? nextCursor = _sentinel,
    bool? hasMoreComments,
  }) {
    return PostDetailState(
      post: post ?? this.post,
      comments: comments ?? this.comments,
      nextCursor:
          nextCursor == _sentinel ? this.nextCursor : nextCursor as String?,
      hasMoreComments: hasMoreComments ?? this.hasMoreComments,
    );
  }

  static const _sentinel = Object();
}

@riverpod
class PostDetail extends _$PostDetail {
  @override
  Future<PostDetailState> build(String postId) async {
    final repo = ref.read(postRepositoryProvider);
    final post = await repo.getPost(postId);
    final result = await repo.getComments(postId);
    return PostDetailState(
      post: post,
      comments: result.comments,
      nextCursor: result.nextCursor,
      hasMoreComments: result.hasMore,
    );
  }

  Future<void> loadMoreComments() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMoreComments) return;
    final result = await ref
        .read(postRepositoryProvider)
        .getComments(current.post.id, cursor: current.nextCursor);
    state = AsyncData(current.copyWith(
      comments: [...current.comments, ...result.comments],
      nextCursor: result.nextCursor,
      hasMoreComments: result.hasMore,
    ));
  }

  Future<void> addComment(String content, {String? replyTo}) async {
    final current = state.valueOrNull;
    if (current == null) return;
    final comment = await ref.read(postRepositoryProvider).addComment(
          current.post.id,
          content: content,
          replyTo: replyTo,
        );
    state = AsyncData(current.copyWith(
      comments: [comment, ...current.comments],
      post: current.post.copyWith(
        commentsCount: current.post.commentsCount + 1,
      ),
    ));
  }

  Future<void> deleteComment(String commentId) async {
    final current = state.valueOrNull;
    if (current == null) return;
    await ref
        .read(postRepositoryProvider)
        .deleteComment(current.post.id, commentId);
    state = AsyncData(current.copyWith(
      comments: current.comments.where((c) => c.id != commentId).toList(),
      post: current.post.copyWith(
        commentsCount: current.post.commentsCount - 1,
      ),
    ));
  }

  Future<void> togglePin() async {
    final current = state.valueOrNull;
    if (current == null) return;
    final repo = ref.read(postRepositoryProvider);
    if (current.post.isPinned) {
      await repo.unpinPost(current.post.id);
    } else {
      await repo.pinPost(current.post.id);
    }
    state = AsyncData(current.copyWith(
      post: current.post.copyWith(isPinned: !current.post.isPinned),
    ));
  }
}
