import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'notification_model.dart';
import 'notification_socket_service.dart';
import 'notifications_repository.dart';

part 'notifications_provider.g.dart';

class NotificationsState {
  const NotificationsState({
    this.notifications = const [],
    this.unreadCount = 0,
    this.isLoadingMore = false,
    this.hasMore = true,
    this.page = 1,
  });

  final List<NotificationModel> notifications;
  final int unreadCount;
  final bool isLoadingMore;
  final bool hasMore;
  final int page;

  NotificationsState copyWith({
    List<NotificationModel>? notifications,
    int? unreadCount,
    bool? isLoadingMore,
    bool? hasMore,
    int? page,
  }) {
    return NotificationsState(
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      hasMore: hasMore ?? this.hasMore,
      page: page ?? this.page,
    );
  }
}

@Riverpod(keepAlive: true)
class Notifications extends _$Notifications {
  static const _pageSize = 20;
  StreamSubscription<Map<String, dynamic>>? _socketSub;

  @override
  Future<NotificationsState> build() async {
    final socket = ref.read(notificationSocketServiceProvider);
    await socket.connect();

    _socketSub = socket.notifications.listen(_onSocketNotification);

    ref.onDispose(() {
      _socketSub?.cancel();
      _socketSub = null;
    });

    final result = await ref
        .read(notificationsRepositoryProvider)
        .getNotifications(page: 1);

    return NotificationsState(
      notifications: result.items,
      unreadCount: result.unreadCount,
      hasMore: result.items.length == _pageSize,
    );
  }

  void _onSocketNotification(Map<String, dynamic> data) {
    final notification = NotificationModel.fromJson(data);
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(current.copyWith(
      notifications: [notification, ...current.notifications],
      unreadCount: current.unreadCount + 1,
    ));
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.isLoadingMore) return;

    state = AsyncData(current.copyWith(isLoadingMore: true));
    final nextPage = current.page + 1;
    try {
      final result = await ref
          .read(notificationsRepositoryProvider)
          .getNotifications(page: nextPage);
      state = AsyncData(current.copyWith(
        notifications: [...current.notifications, ...result.items],
        unreadCount: result.unreadCount,
        hasMore: result.items.length == _pageSize,
        isLoadingMore: false,
        page: nextPage,
      ));
    } catch (_) {
      state = AsyncData(current.copyWith(isLoadingMore: false));
    }
  }

  Future<void> markRead(String id) async {
    final current = state.valueOrNull;
    if (current == null) return;
    final notification = current.notifications.firstWhere(
      (n) => n.id == id,
      orElse: () => current.notifications.first,
    );
    if (notification.isRead) return;

    state = AsyncData(current.copyWith(
      notifications: current.notifications.map((n) {
        return n.id == id ? n.copyWith(isRead: true) : n;
      }).toList(),
      unreadCount: (current.unreadCount - 1).clamp(0, current.unreadCount),
    ));
    try {
      await ref.read(notificationsRepositoryProvider).markRead(id);
    } catch (_) {
      state = AsyncData(current);
    }
  }

  Future<void> markAllRead() async {
    final current = state.valueOrNull;
    if (current == null || current.unreadCount == 0) return;

    state = AsyncData(current.copyWith(
      notifications: current.notifications
          .map((n) => n.copyWith(isRead: true))
          .toList(),
      unreadCount: 0,
    ));
    try {
      await ref.read(notificationsRepositoryProvider).markAllRead();
    } catch (_) {
      state = AsyncData(current);
    }
  }

  Future<void> delete(String id) async {
    final current = state.valueOrNull;
    if (current == null) return;
    final notification = current.notifications.firstWhere(
      (n) => n.id == id,
      orElse: () => current.notifications.first,
    );

    state = AsyncData(current.copyWith(
      notifications: current.notifications.where((n) => n.id != id).toList(),
      unreadCount: notification.isRead
          ? current.unreadCount
          : (current.unreadCount - 1).clamp(0, current.unreadCount),
    ));
    try {
      await ref.read(notificationsRepositoryProvider).delete(id);
    } catch (_) {
      state = AsyncData(current);
    }
  }
}

@riverpod
int unreadNotificationsCount(Ref ref) {
  return ref.watch(notificationsProvider).valueOrNull?.unreadCount ?? 0;
}
