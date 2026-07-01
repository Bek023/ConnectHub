import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'comment_model.dart';
import 'post_model.dart';

part 'post_repository.g.dart';

class CommentsResult {
  const CommentsResult({
    required this.comments,
    this.nextCursor,
    required this.hasMore,
  });
  final List<CommentModel> comments;
  final String? nextCursor;
  final bool hasMore;
}

@riverpod
PostRepository postRepository(Ref ref) {
  return PostRepository(ref.watch(dioClientProvider));
}

class PostRepository {
  PostRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<PostModel> getPost(String postId) async {
    try {
      final res = await _dio.get(ApiEndpoints.postById(postId));
      return PostModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<CommentsResult> getComments(String postId, {String? cursor}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.postComments(postId),
        queryParameters: {
          if (cursor != null) 'cursor': cursor,
          'limit': 20,
        },
      );
      final data = res.data['data'] as Map<String, dynamic>;
      final items = data['items'] as List<dynamic>;
      final comments = items
          .map((e) => CommentModel.fromJson(e as Map<String, dynamic>))
          .toList();
      final nextCursor = comments.isNotEmpty ? comments.last.id : null;
      return CommentsResult(
        comments: comments,
        nextCursor: nextCursor,
        hasMore: comments.length == 20,
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<CommentModel> addComment(
    String postId, {
    required String content,
    String? replyTo,
  }) async {
    try {
      final res = await _dio.post(
        ApiEndpoints.postComments(postId),
        data: {
          'content': content,
          if (replyTo != null) 'replyTo': replyTo,
        },
      );
      return CommentModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deleteComment(String postId, String commentId) async {
    try {
      await _dio.delete(ApiEndpoints.postComment(postId, commentId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> pinPost(String postId) async {
    try {
      await _dio.post(ApiEndpoints.postPin(postId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> unpinPost(String postId) async {
    try {
      await _dio.delete(ApiEndpoints.postPin(postId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deletePost(String postId) async {
    try {
      await _dio.delete(ApiEndpoints.postById(postId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
