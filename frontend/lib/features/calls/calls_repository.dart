import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'call_model.dart';

part 'calls_repository.g.dart';

@riverpod
CallsRepository callsRepository(Ref ref) {
  return CallsRepository(ref.watch(dioClientProvider));
}

class CallsRepository {
  CallsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<CallModel> initiateCall({
    required String chatId,
    required String type,
  }) async {
    try {
      final res = await _dio.post(
        ApiEndpoints.callInitiate,
        data: {'chatId': chatId, 'type': type},
      );
      return CallModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<CallModel> joinCall(String callId) async {
    try {
      final res = await _dio.post(ApiEndpoints.callJoin(callId));
      return CallModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> leaveCall(String callId) async {
    try {
      await _dio.delete(ApiEndpoints.callLeave(callId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> endCall(String callId) async {
    try {
      await _dio.post(ApiEndpoints.callEnd(callId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<List<CallParticipantModel>> getParticipants(String callId) async {
    try {
      final res = await _dio.get(ApiEndpoints.callParticipants(callId));
      final items = res.data['data']['participants'] as List<dynamic>;
      return items
          .map((e) => CallParticipantModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<List<CallModel>> getHistory({int page = 1}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.callHistory,
        queryParameters: {'page': page},
      );
      final items = res.data['data']['items'] as List<dynamic>;
      return items
          .map((e) => CallModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
