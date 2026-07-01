import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';

part 'settings_repository.g.dart';

@riverpod
SettingsRepository settingsRepository(Ref ref) {
  return SettingsRepository(ref.watch(dioClientProvider));
}

class SettingsRepository {
  SettingsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      await _dio.post(ApiEndpoints.changePassword, data: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      });
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<String> setup2FA() async {
    try {
      final res = await _dio.get(ApiEndpoints.twoFaSetup);
      return res.data['data']['otpauthUrl'] as String;
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> enable2FA(String totpCode) async {
    try {
      await _dio.post(ApiEndpoints.twoFaEnable, data: {'totpCode': totpCode});
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> disable2FA(String totpCode) async {
    try {
      await _dio.post(ApiEndpoints.twoFaDisable, data: {'totpCode': totpCode});
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deleteAccount() async {
    try {
      await _dio.delete(ApiEndpoints.usersMe);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
