import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'goal_model.dart';

part 'goals_repository.g.dart';

@riverpod
GoalsRepository goalsRepository(Ref ref) {
  return GoalsRepository(ref.watch(dioClientProvider));
}

class GoalsRepository {
  GoalsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<List<GoalModel>> getTrending({int page = 1, int limit = 20}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.goalsTrending,
        queryParameters: {'page': page, 'limit': limit},
      );
      final raw = res.data['data'];
      final items =
          raw is List ? raw : (raw['items'] as List<dynamic>? ?? const []);
      return items
          .map((e) => GoalModel.fromApi(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<List<GoalModel>> getMyGoals({int page = 1, int limit = 20}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.goalsMy,
        queryParameters: {'page': page, 'limit': limit},
      );
      final raw = res.data['data'];
      final items =
          raw is List ? raw : (raw['items'] as List<dynamic>? ?? const []);
      return items
          .map((e) => GoalModel.fromApi(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GoalModel> getGoal(String goalId) async {
    try {
      final res = await _dio.get(ApiEndpoints.goalById(goalId));
      return GoalModel.fromApi(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GoalModel> createGoal({
    required String title,
    String? description,
    required String category,
    String? imageUrl,
  }) async {
    try {
      final res = await _dio.post(
        ApiEndpoints.goals,
        data: {
          'title': title,
          if (description != null) 'description': description,
          'category': category,
          if (imageUrl != null) 'imageUrl': imageUrl,
        },
      );
      return GoalModel.fromApi(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> joinGoal(String goalId) async {
    try {
      await _dio.post(ApiEndpoints.goalJoin(goalId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> leaveGoal(String goalId) async {
    try {
      await _dio.delete(ApiEndpoints.goalLeave(goalId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deleteGoal(String goalId) async {
    try {
      await _dio.delete(ApiEndpoints.goalById(goalId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
