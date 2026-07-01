import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/api/api_endpoints.dart';
import '../../core/api/dio_client.dart';
import '../../core/core_providers.dart';
import 'channel_model.dart';

part 'channels_repository.g.dart';

@riverpod
ChannelsRepository channelsRepository(Ref ref) {
  return ChannelsRepository(ref.watch(dioClientProvider));
}

class ChannelsRepository {
  ChannelsRepository(this._client);

  final DioClient _client;
  Dio get _dio => _client.dio;

  Future<List<ChannelModel>> getMyChannels({int page = 1, int limit = 20}) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.channelsMy,
        queryParameters: {'page': page, 'limit': limit},
      );
      final items = res.data['data']['items'] as List<dynamic>;
      return items
          .map((e) => ChannelModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<List<ChannelModel>> discoverChannels({
    int page = 1,
    int limit = 20,
    String? category,
  }) async {
    try {
      final res = await _dio.get(
        ApiEndpoints.channels,
        queryParameters: {
          'page': page,
          'limit': limit,
          if (category != null) 'category': category,
        },
      );
      final items = res.data['data']['items'] as List<dynamic>;
      return items
          .map((e) => ChannelModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<ChannelModel> getChannel(String channelId) async {
    try {
      final res = await _dio.get(ApiEndpoints.channelById(channelId));
      return ChannelModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<ChannelStatsModel> getStats(String channelId) async {
    try {
      final res = await _dio.get(ApiEndpoints.channelStats(channelId));
      return ChannelStatsModel.fromJson(
          res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<ChannelModel> createChannel({
    required String name,
    String? description,
    String? category,
  }) async {
    try {
      final res = await _dio.post(
        ApiEndpoints.channels,
        data: {
          'name': name,
          if (description != null) 'description': description,
          if (category != null) 'category': category,
        },
      );
      return ChannelModel.fromJson(res.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> subscribe(String channelId) async {
    try {
      await _dio.post(ApiEndpoints.channelSubscribe(channelId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> unsubscribe(String channelId) async {
    try {
      await _dio.delete(ApiEndpoints.channelUnsubscribe(channelId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }

  Future<void> deleteChannel(String channelId) async {
    try {
      await _dio.delete(ApiEndpoints.channelById(channelId));
    } on DioException catch (e) {
      throw DioClient.mapError(e);
    }
  }
}
