import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../notifications/notifications_provider.dart';
import '../feed_notifier.dart';
import '../widgets/post_card.dart';

class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({super.key});

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 300) {
      ref.read(feedProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final feedState = ref.watch(feedProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ConnectHub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          _NotificationBell(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.createPost),
        child: const Icon(Icons.edit_outlined),
      ),
      body: feedState.when(
        data: (posts) {
          if (posts.isEmpty) {
            return AppEmptyState(
              icon: Icons.dynamic_feed_outlined,
              title: 'Hali postlar yo\'q',
              subtitle: 'Guruh yoki kanallarga qo\'shiling',
            );
          }
          return RefreshIndicator(
            onRefresh: () => ref.read(feedProvider.notifier).refresh(),
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(AppSpacing.space4),
              itemCount: posts.length + 1,
              itemBuilder: (ctx, i) {
                if (i == posts.length) {
                  return const _LoadMoreIndicator();
                }
                final post = posts[i];
                return PostCard(
                  post: post,
                  onLike: () =>
                      ref.read(feedProvider.notifier).toggleLike(post.id),
                  onComment: () =>
                      context.push(AppRoutes.postDetailRoute(post.id)),
                  onShare: () => Share.share(post.content),
                );
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(feedProvider),
        ),
      ),
    );
  }
}

class _NotificationBell extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unread = ref.watch(unreadNotificationsCountProvider);
    return Stack(
      alignment: Alignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () => context.push(AppRoutes.notifications),
        ),
        if (unread > 0)
          Positioned(
            top: 8,
            right: 8,
            child: Container(
              width: 16,
              height: 16,
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  unread > 9 ? '9+' : '$unread',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _LoadMoreIndicator extends StatelessWidget {
  const _LoadMoreIndicator();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: AppSpacing.space6),
      child: Center(
        child: SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    );
  }
}
