import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../notifications_provider.dart';
import '../widgets/notification_tile.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 100) {
      ref.read(notificationsProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Bildirishnomalar', style: AppTextStyles.heading3),
        actions: [
          if (state.valueOrNull?.unreadCount != null &&
              state.valueOrNull!.unreadCount > 0)
            TextButton(
              onPressed: () =>
                  ref.read(notificationsProvider.notifier).markAllRead(),
              child: Text(
                'Hammasini o\'qi',
                style: AppTextStyles.labelSm.copyWith(
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
      body: state.when(
        data: (s) {
          if (s.notifications.isEmpty) {
            return const AppEmptyState(
              icon: Icons.notifications_outlined,
              title: 'Bildirishnomalar yo\'q',
              subtitle: 'Yangi bildirishnomalar shu yerda ko\'rinadi',
            );
          }
          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(notificationsProvider),
            child: ListView.separated(
              controller: _scrollController,
              itemCount: s.notifications.length + (s.isLoadingMore ? 1 : 0),
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (_, i) {
                if (i == s.notifications.length) {
                  return const Padding(
                    padding: EdgeInsets.all(AppSpacing.space4),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }
                final n = s.notifications[i];
                return NotificationTile(
                  notification: n,
                  onTap: () {
                    if (!n.isRead) {
                      ref
                          .read(notificationsProvider.notifier)
                          .markRead(n.id);
                    }
                    _handleTap(n.type, n.data);
                  },
                  onDelete: () =>
                      ref.read(notificationsProvider.notifier).delete(n.id),
                );
              },
            ),
          );
        },
        loading: () => const _NotificationsShimmer(),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(notificationsProvider),
        ),
      ),
    );
  }

  void _handleTap(String type, Map<String, dynamic> data) {}
}

class _NotificationsShimmer extends StatelessWidget {
  const _NotificationsShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: ListView.separated(
        itemCount: 8,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (_, i) => Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space4,
            vertical: AppSpacing.space3,
          ),
          child: Row(
            children: const [
              ShimmerCircle(size: 44),
              SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(width: 160, height: 14),
                    SizedBox(height: 6),
                    ShimmerBox(width: double.infinity, height: 12),
                    SizedBox(height: 4),
                    ShimmerBox(width: 80, height: 11),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
