import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'profile_model.dart';

part 'profile_repository.g.dart';

@riverpod
ProfileRepository profileRepository(Ref ref) {
  return ProfileRepository(ref.watch(dioClientProvider));
}

class ProfileRepository {
  ProfileRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<ProfileModel> getMyProfile() async {
    try {
      final res = await _dio.get(ApiEndpoints.usersMe);
      return ProfileModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<ProfileModel> getUserById(String userId) async {
    try {
      final res = await _dio.get(ApiEndpoints.userById(userId));
      return ProfileModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<ProfileModel> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
  }) async {
    try {
      final res = await _dio.put(
        ApiEndpoints.usersMe,
        data: {
          if (displayName != null) 'displayName': displayName,
          if (bio != null) 'bio': bio,
          if (avatarUrl != null) 'avatarUrl': avatarUrl,
        },
      );
      return ProfileModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<String> uploadAvatar(XFile file) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          file.path,
          filename: file.name,
        ),
        'type': 'image',
      });
      final res = await _dio.post(ApiEndpoints.mediaUpload, data: formData);
      return res.data['data']['url'] as String;
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<List<ProfileModel>> searchUsers(String query, {int page = 1}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.usersSearch,
        queryParameters: {'q': query, 'page': page, 'limit': 20},
      );
      final items = res.data['data']['items'] as List<dynamic>;
      return items
          .map((e) => ProfileModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
