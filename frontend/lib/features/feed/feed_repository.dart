import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'post_model.dart';

part 'feed_repository.g.dart';

@riverpod
FeedRepository feedRepository(Ref ref) {
  return FeedRepository(ref.watch(dioClientProvider));
}

class FeedRepository {
  FeedRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<List<PostModel>> getFeed({int page = 1, int limit = 20}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.postsFeed,
        queryParameters: {'page': page, 'limit': limit},
      );
      final data = res.data['data'] as Map<String, dynamic>;
      final items = data['items'] as List<dynamic>;
      return items
          .map((e) => PostModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> likePost(String postId) async {
    try {
      await _dio.post(ApiEndpoints.postLike(postId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> unlikePost(String postId) async {
    try {
      await _dio.delete(ApiEndpoints.postLike(postId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<PostModel> createPost({
    required String content,
    List<String> mediaUrls = const [],
    String? chatType,
    String? chatId,
  }) async {
    try {
      final res = await _dio.post(ApiEndpoints.posts, data: {
        'content': content,
        if (mediaUrls.isNotEmpty) 'mediaUrls': mediaUrls,
        if (chatType != null) 'chatType': chatType,
        if (chatId != null) 'chatId': chatId,
      });
      return PostModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
