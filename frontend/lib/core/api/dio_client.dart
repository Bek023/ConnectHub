import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import '../storage/secure_storage.dart';
import 'api_endpoints.dart';
import 'api_exception.dart';

/// Markazlashtirilgan Dio instance.
/// - Har bir so'rovga `Authorization` header avtomatik qo'shiladi.
/// - 401 kelganda `refreshTokens` chaqirilib, so'rov qayta yuboriladi
///   (qarang: API_DOCS.md > "Auto refresh interceptor (dio)").
class DioClient {
  DioClient._(this._secureStorage) {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
      ),
    );

    _dio.interceptors.addAll([
      _authInterceptor(),
      if (kDebugMode)
        PrettyDioLogger(
          requestBody: true,
          responseBody: true,
          error: true,
        ),
    ]);
  }

  final SecureStorage _secureStorage;
  late final Dio _dio;

  Completer<String?>? _refreshCompleter;

  void Function()? onSessionExpired;

  Dio get dio => _dio;

  static DioClient create(SecureStorage secureStorage) =>
      DioClient._(secureStorage);

  InterceptorsWrapper _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.readAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        final isUnauthorized = error.response?.statusCode == 401;
        final isRefreshCall = error.requestOptions.path == ApiEndpoints.refresh;

        if (isUnauthorized && !isRefreshCall) {
          final refreshed = await _tryRefresh();
          if (refreshed != null) {
            try {
              error.requestOptions.headers['Authorization'] =
                  'Bearer $refreshed';
              final cloned = await _dio.fetch(error.requestOptions);
              return handler.resolve(cloned);
            } catch (_) {}
          } else {
            await _secureStorage.clearTokens();
            onSessionExpired?.call();
          }
        }

        handler.next(error);
      },
    );
  }

  Future<String?> _tryRefresh() async {
    final pending = _refreshCompleter;
    if (pending != null) return pending.future;

    final completer = Completer<String?>();
    _refreshCompleter = completer;
    try {
      final token = await _doRefresh();
      completer.complete(token);
    } catch (_) {
      completer.complete(null);
    } finally {
      _refreshCompleter = null;
    }
    return completer.future;
  }

  Future<String?> _doRefresh() async {
    final userId = await _secureStorage.readUserId();
    final refreshToken = await _secureStorage.readRefreshToken();
    if (userId == null || refreshToken == null) return null;

    final response = await _dio.post(ApiEndpoints.refresh, data: {
      'userId': userId,
      'refreshToken': refreshToken,
    });

    final data = response.data['data'] as Map<String, dynamic>;
    final newAccessToken = data['accessToken'] as String;
    final newRefreshToken = data['refreshToken'] as String;

    await _secureStorage.saveTokens(
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: data['userId'] as String? ?? userId,
    );

    return newAccessToken;
  }

  /// DioException'ni domain darajasidagi [ApiException] ga aylantirish.
  static ApiException mapError(DioException error) {
    if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      return ApiException.network();
    }
    if (error.response != null) {
      return ApiException.fromResponseData(
        error.response!.data,
        statusCode: error.response!.statusCode,
      );
    }
    return ApiException.unknown(error);
  }
}
