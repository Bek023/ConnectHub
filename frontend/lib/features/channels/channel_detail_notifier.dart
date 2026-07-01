import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'channel_model.dart';
import 'channels_notifier.dart';
import 'channels_repository.dart';

part 'channel_detail_notifier.g.dart';

class ChannelDetailState {
  const ChannelDetailState({
    required this.channel,
    this.stats,
    this.statsLoading = false,
  });

  final ChannelModel channel;
  final ChannelStatsModel? stats;
  final bool statsLoading;

  ChannelDetailState copyWith({
    ChannelModel? channel,
    ChannelStatsModel? stats,
    bool? statsLoading,
  }) {
    return ChannelDetailState(
      channel: channel ?? this.channel,
      stats: stats ?? this.stats,
      statsLoading: statsLoading ?? this.statsLoading,
    );
  }
}

@riverpod
class ChannelDetail extends _$ChannelDetail {
  @override
  Future<ChannelDetailState> build(String channelId) async {
    final channel =
        await ref.read(channelsRepositoryProvider).getChannel(channelId);
    return ChannelDetailState(channel: channel);
  }

  Future<void> loadStats() async {
    final current = state.valueOrNull;
    if (current == null || !current.channel.isOwner) return;
    state = AsyncData(current.copyWith(statsLoading: true));
    try {
      final stats = await ref
          .read(channelsRepositoryProvider)
          .getStats(current.channel.id);
      state = AsyncData(current.copyWith(stats: stats, statsLoading: false));
    } catch (_) {
      state = AsyncData(current.copyWith(statsLoading: false));
    }
  }

  Future<void> toggleSubscribe() async {
    final current = state.valueOrNull;
    if (current == null) return;
    final wasSubscribed = current.channel.isSubscribed;
    state = AsyncData(current.copyWith(
      channel: current.channel.copyWith(
        isSubscribed: !wasSubscribed,
        subscribersCount: wasSubscribed
            ? current.channel.subscribersCount - 1
            : current.channel.subscribersCount + 1,
      ),
    ));
    try {
      final repo = ref.read(channelsRepositoryProvider);
      if (wasSubscribed) {
        await repo.unsubscribe(current.channel.id);
        ref
            .read(myChannelsProvider.notifier)
            .removeChannel(current.channel.id);
      } else {
        await repo.subscribe(current.channel.id);
        ref
            .read(myChannelsProvider.notifier)
            .addChannel(state.valueOrNull!.channel);
      }
      ref.read(discoverChannelsProvider.notifier).updateSubscription(
            current.channel.id,
            isSubscribed: !wasSubscribed,
          );
    } catch (_) {
      state = AsyncData(current);
    }
  }
}
