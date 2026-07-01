import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'api/dio_client.dart';
import 'storage/secure_storage.dart';

part 'core_providers.g.dart';

@Riverpod(keepAlive: true)
SecureStorage secureStorage(Ref ref) => SecureStorage();

@Riverpod(keepAlive: true)
DioClient dioClient(Ref ref) {
  final storage = ref.watch(secureStorageProvider);
  return DioClient.create(storage);
}
