import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'group_model.dart';

part 'groups_repository.g.dart';

class MembersResult {
  const MembersResult({
    required this.members,
    this.nextCursor,
    required this.hasMore,
  });
  final List<GroupMemberModel> members;
  final String? nextCursor;
  final bool hasMore;
}

@riverpod
GroupsRepository groupsRepository(Ref ref) {
  return GroupsRepository(ref.watch(dioClientProvider));
}

class GroupsRepository {
  GroupsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<List<GroupModel>> getMyGroups({int page = 1, int limit = 20}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.groupsMy,
        queryParameters: {'page': page, 'limit': limit},
      );
      final items = res.data['data']['items'] as List<dynamic>;
      return items
          .map((e) => GroupModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GroupModel> getGroup(String groupId) async {
    try {
      final res = await _dio.get(ApiEndpoints.groupById(groupId));
      return GroupModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<MembersResult> getMembers(String groupId, {String? cursor}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.groupMembers(groupId),
        queryParameters: {
          if (cursor != null) 'cursor': cursor,
          'limit': 20,
        },
      );
      final data = res.data['data'] as Map<String, dynamic>;
      final items = data['items'] as List<dynamic>;
      final members = items
          .map((e) => GroupMemberModel.fromJson(e as Map<String, dynamic>))
          .toList();
      return MembersResult(
        members: members,
        nextCursor: members.isNotEmpty ? members.last.id : null,
        hasMore: members.length == 20,
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GroupModel> createGroup({
    required String title,
    String? description,
    String type = 'public',
  }) async {
    try {
      final res = await _dio.post(
        ApiEndpoints.groups,
        data: {
          'title': title,
          if (description != null) 'description': description,
          'type': type,
        },
      );
      return GroupModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GroupModel> joinGroup(String groupId) async {
    try {
      final res = await _dio.post(ApiEndpoints.groupJoin(groupId));
      return GroupModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<GroupModel> joinGroupByCode(String code) async {
    try {
      final res = await _dio.post(ApiEndpoints.groupJoinByCode(code));
      return GroupModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> leaveGroup(String groupId) async {
    try {
      await _dio.delete(ApiEndpoints.groupLeave(groupId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> updateMemberRole(
    String groupId,
    String userId,
    String role,
  ) async {
    try {
      await _dio.put(
        ApiEndpoints.groupMember(groupId, userId),
        data: {'role': role},
      );
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> removeMember(String groupId, String userId) async {
    try {
      await _dio.delete(ApiEndpoints.groupMember(groupId, userId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
