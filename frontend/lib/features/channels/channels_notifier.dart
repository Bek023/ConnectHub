import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'channel_model.dart';
import 'channels_repository.dart';

part 'channels_notifier.g.dart';

@riverpod
class MyChannels extends _$MyChannels {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<ChannelModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref
        .read(channelsRepositoryProvider)
        .getMyChannels(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(channelsRepositoryProvider)
          .getMyChannels(page: _page, limit: _limit);
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

  void addChannel(ChannelModel channel) {
    final current = state.valueOrNull ?? [];
    state = AsyncData([channel, ...current]);
  }

  void removeChannel(String channelId) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(current.where((c) => c.id != channelId).toList());
  }

  void updateSubscription(String channelId, {required bool isSubscribed}) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.map((c) {
        if (c.id != channelId) return c;
        return c.copyWith(
          isSubscribed: isSubscribed,
          subscribersCount:
              isSubscribed ? c.subscribersCount + 1 : c.subscribersCount - 1,
        );
      }).toList(),
    );
  }
}

@riverpod
class DiscoverChannels extends _$DiscoverChannels {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<ChannelModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref
        .read(channelsRepositoryProvider)
        .discoverChannels(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(channelsRepositoryProvider)
          .discoverChannels(page: _page, limit: _limit);
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

  void updateSubscription(String channelId, {required bool isSubscribed}) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.map((c) {
        if (c.id != channelId) return c;
        return c.copyWith(
          isSubscribed: isSubscribed,
          subscribersCount:
              isSubscribed ? c.subscribersCount + 1 : c.subscribersCount - 1,
        );
      }).toList(),
    );
  }
}
