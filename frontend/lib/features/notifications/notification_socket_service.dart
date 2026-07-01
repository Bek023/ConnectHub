import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/core_providers.dart';
import '../../core/socket/socket_client.dart';
import '../../core/socket/socket_events.dart';
import '../../core/storage/secure_storage.dart';

part 'notification_socket_service.g.dart';

@Riverpod(keepAlive: true)
NotificationSocketService notificationSocketService(Ref ref) {
  final storage = ref.watch(secureStorageProvider);
  final service = NotificationSocketService(storage);
  ref.onDispose(service.dispose);
  return service;
}

class NotificationSocketService {
  NotificationSocketService(this._storage);

  final SecureStorage _storage;
  SocketClient? _socket;

  final _notificationCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _messagePreviewCtrl =
      StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get notifications => _notificationCtrl.stream;
  Stream<Map<String, dynamic>> get messagePreviews =>
      _messagePreviewCtrl.stream;

  Future<void> connect() async {
    if (_socket != null) return;
    final token = await _storage.readAccessToken();
    if (token == null) return;
    _socket = SocketClient.connect(
      namespace: '/notifications',
      accessToken: token,
    );
    _socket!.on(SocketEvents.notification, (d) {
      if (d is Map<String, dynamic>) _notificationCtrl.add(d);
    });
    _socket!.on(SocketEvents.newMessage, (d) {
      if (d is Map<String, dynamic>) _messagePreviewCtrl.add(d);
    });
  }

  void dispose() {
    _notificationCtrl.close();
    _messagePreviewCtrl.close();
    _socket?.dispose();
    _socket = null;
  }
}
