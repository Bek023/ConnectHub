import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'notification_model.dart';

part 'notifications_repository.g.dart';

@riverpod
NotificationsRepository notificationsRepository(Ref ref) {
  return NotificationsRepository(ref.watch(dioClientProvider));
}

class NotificationsRepository {
  NotificationsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<({List<NotificationModel> items, int unreadCount})> getNotifications({
    int page = 1,
    bool unreadOnly = false,
  }) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.notifications,
        queryParameters: {
          'page': page,
          if (unreadOnly) 'unreadOnly': true,
        },
      );
      final data = res.data['data'] as Map<String, dynamic>;
      final items = (data['items'] as List<dynamic>)
          .map((e) => NotificationModel.fromApi(e as Map<String, dynamic>))
          .toList();
      final unreadCount = data['unreadCount'] as int? ?? 0;
      return (items: items, unreadCount: unreadCount);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> markRead(String id) async {
    try {
      await _dio.put(ApiEndpoints.notificationRead(id));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> markAllRead() async {
    try {
      await _dio.put(ApiEndpoints.notificationsReadAll);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete(ApiEndpoints.notificationById(id));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> registerPushToken({
    required String token,
    required String platform,
  }) async {
    try {
      await _dio.post(
        ApiEndpoints.notificationsPushRegister,
        data: {'token': token, 'platform': platform},
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
