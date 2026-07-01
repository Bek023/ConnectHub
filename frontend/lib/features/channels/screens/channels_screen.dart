import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../channel_detail_notifier.dart';
import '../channels_notifier.dart';
import '../widgets/channel_card.dart';

class ChannelsScreen extends ConsumerWidget {
  const ChannelsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Kanallar'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Mening'),
              Tab(text: 'Kashf et'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => context.push(AppRoutes.createChannel),
            ),
          ],
        ),
        body: const TabBarView(
          children: [
            _MyChannelsTab(),
            _DiscoverTab(),
          ],
        ),
      ),
    );
  }
}

class _MyChannelsTab extends ConsumerStatefulWidget {
  const _MyChannelsTab();

  @override
  ConsumerState<_MyChannelsTab> createState() => _MyChannelsTabState();
}

class _MyChannelsTabState extends ConsumerState<_MyChannelsTab> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 300) {
        ref.read(myChannelsProvider.notifier).loadMore();
      }
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(myChannelsProvider);
    return state.when(
      data: (channels) {
        if (channels.isEmpty) {
          return AppEmptyState(
            icon: Icons.campaign_outlined,
            title: 'Hali kanallar yo\'q',
            subtitle: 'Yangi kanal yarating yoki obuna bo\'ling',
            actionLabel: 'Kashf et',
            onAction: () => DefaultTabController.of(context).animateTo(1),
          );
        }
        return RefreshIndicator(
          onRefresh: () => ref.read(myChannelsProvider.notifier).refresh(),
          child: ListView.builder(
            controller: _scroll,
            padding: const EdgeInsets.all(AppSpacing.space4),
            itemCount: channels.length,
            itemBuilder: (ctx, i) {
              final ch = channels[i];
              return ChannelCard(
                channel: ch,
                onTap: () =>
                    context.push(AppRoutes.channelDetailRoute(ch.id)),
                onSubscribe: () => ref
                    .read(channelDetailProvider(ch.id).notifier)
                    .toggleSubscribe(),
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => AppErrorState(
        message: e.toString().replaceFirst('Exception: ', ''),
        onRetry: () => ref.invalidate(myChannelsProvider),
      ),
    );
  }
}

class _DiscoverTab extends ConsumerStatefulWidget {
  const _DiscoverTab();

  @override
  ConsumerState<_DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends ConsumerState<_DiscoverTab> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 300) {
        ref.read(discoverChannelsProvider.notifier).loadMore();
      }
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(discoverChannelsProvider);
    return state.when(
      data: (channels) {
        if (channels.isEmpty) {
          return AppEmptyState(
            icon: Icons.search_outlined,
            title: 'Kanallar topilmadi',
            subtitle: 'Birinchi bo\'lib kanal yarating',
          );
        }
        return RefreshIndicator(
          onRefresh: () =>
              ref.read(discoverChannelsProvider.notifier).refresh(),
          child: ListView.builder(
            controller: _scroll,
            padding: const EdgeInsets.all(AppSpacing.space4),
            itemCount: channels.length,
            itemBuilder: (ctx, i) {
              final ch = channels[i];
              return ChannelCard(
                channel: ch,
                onTap: () =>
                    context.push(AppRoutes.channelDetailRoute(ch.id)),
                onSubscribe: () => ref
                    .read(channelDetailProvider(ch.id).notifier)
                    .toggleSubscribe(),
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => AppErrorState(
        message: e.toString().replaceFirst('Exception: ', ''),
        onRetry: () => ref.invalidate(discoverChannelsProvider),
      ),
    );
  }
}
