import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'message_model.dart';

part 'chat_repository.g.dart';

@riverpod
ChatRepository chatRepository(Ref ref) {
  return ChatRepository(ref.watch(dioClientProvider));
}

class MessagesPage {
  const MessagesPage({required this.messages, this.nextCursor});

  final List<MessageModel> messages;
  final String? nextCursor;
}

class ChatRepository {
  ChatRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<MessagesPage> getMessages({
    required String chatType,
    required String chatId,
    String? cursor,
    int limit = 30,
  }) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.messages(chatType, chatId),
        queryParameters: {
          'limit': limit,
          if (cursor != null) 'cursor': cursor,
        },
      );
      final data = res.data['data'] as Map<String, dynamic>;
      final items = data['items'] as List<dynamic>;
      return MessagesPage(
        messages: items
            .map((e) => MessageModel.fromApi(e as Map<String, dynamic>))
            .toList(),
        nextCursor: data['nextCursor'] as String?,
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> editMessage(String messageId, String content) async {
    try {
      await _dio.put(
        ApiEndpoints.messageById(messageId),
        data: {'content': content},
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deleteMessage(String messageId) async {
    try {
      await _dio.delete(ApiEndpoints.messageById(messageId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> reactToMessage(String messageId, String emoji) async {
    try {
      await _dio.post(
        ApiEndpoints.messageReact(messageId),
        data: {'emoji': emoji},
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
