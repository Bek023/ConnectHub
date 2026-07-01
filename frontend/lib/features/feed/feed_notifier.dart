import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'feed_repository.dart';
import 'post_model.dart';

part 'feed_notifier.g.dart';

@riverpod
class Feed extends _$Feed {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<PostModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref.read(feedRepositoryProvider).getFeed(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore) return;
    if (state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(feedRepositoryProvider)
          .getFeed(page: _page, limit: _limit);
      _hasMore = more.length == _limit;
      state = AsyncData([...current, ...more]);
    } catch (_) {
      _page--;
    }
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    ref.invalidateSelf();
    await future;
  }

  Future<void> createPost({
    required String content,
    String? groupId,
    String? channelId,
  }) async {
    final post = await ref.read(feedRepositoryProvider).createPost(
          content: content,
          mediaUrls: [],
          chatType: groupId != null
              ? 'group'
              : channelId != null
                  ? 'channel'
                  : null,
          chatId: groupId ?? channelId,
        );
    final current = state.valueOrNull ?? [];
    state = AsyncData([post, ...current]);
  }

  Future<void> toggleLike(String postId) async {
    final current = state.valueOrNull;
    if (current == null) return;

    final original = current.firstWhere((p) => p.id == postId);
    final wasLiked = original.isLiked;

    state = AsyncData(
      current
          .map((p) => p.id == postId
              ? p.copyWith(
                  isLiked: !wasLiked,
                  likesCount:
                      wasLiked ? p.likesCount - 1 : p.likesCount + 1,
                )
              : p)
          .toList(),
    );

    try {
      final repo = ref.read(feedRepositoryProvider);
      if (wasLiked) {
        await repo.unlikePost(postId);
      } else {
        await repo.likePost(postId);
      }
    } catch (_) {
      state = AsyncData(
        (state.valueOrNull ?? current)
            .map((p) => p.id == postId ? original : p)
            .toList(),
      );
    }
  }
}
