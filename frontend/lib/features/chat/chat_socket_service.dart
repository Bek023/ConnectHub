import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/socket/socket_client.dart';
import '../../core/socket/socket_events.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/core_providers.dart';

part 'chat_socket_service.g.dart';

@Riverpod(keepAlive: true)
ChatSocketService chatSocketService(Ref ref) {
  final storage = ref.watch(secureStorageProvider);
  final service = ChatSocketService(storage);
  ref.onDispose(service.dispose);
  return service;
}

class ChatSocketService {
  ChatSocketService(this._secureStorage);

  final SecureStorage _secureStorage;
  SocketClient? _socket;

  final _newMessageCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _typingCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _reactionCtrl =
      StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get newMessages => _newMessageCtrl.stream;
  Stream<Map<String, dynamic>> get typing => _typingCtrl.stream;
  Stream<Map<String, dynamic>> get reactions => _reactionCtrl.stream;

  bool get isConnected => _socket != null;

  Future<void> connect() async {
    if (_socket != null) return;
    final token = await _secureStorage.readAccessToken();
    if (token == null) return;
    _socket = SocketClient.connect(
      namespace: '/chat',
      accessToken: token,
    );
    _socket!.on(SocketEvents.newMessage, (data) {
      if (data is Map<String, dynamic>) _newMessageCtrl.add(data);
    });
    _socket!.on(SocketEvents.userTyping, (data) {
      if (data is Map<String, dynamic>) _typingCtrl.add(data);
    });
    _socket!.on(SocketEvents.messageReaction, (data) {
      if (data is Map<String, dynamic>) _reactionCtrl.add(data);
    });
  }

  void joinChat(String chatId) =>
      _socket?.emit(SocketEvents.joinChat, {'chatId': chatId});

  void leaveChat(String chatId) =>
      _socket?.emit(SocketEvents.leaveChat, {'chatId': chatId});

  void sendMessage({
    required String chatType,
    required String chatId,
    required String content,
    String type = 'text',
    String? mediaUrl,
  }) {
    _socket?.emit(SocketEvents.sendMessage, {
      'chatType': chatType,
      'chatId': chatId,
      'content': content,
      'type': type,
      if (mediaUrl != null) 'mediaUrl': mediaUrl,
    });
  }

  void sendTyping(String chatId) =>
      _socket?.emit(SocketEvents.typing, {'chatId': chatId});

  void reactToMessage(String messageId, String emoji) =>
      _socket?.emit(SocketEvents.reactToMessage, {
        'messageId': messageId,
        'emoji': emoji,
      });

  void markRead(String messageId) =>
      _socket?.emit(SocketEvents.markRead, {'messageId': messageId});

  void dispose() {
    _newMessageCtrl.close();
    _typingCtrl.close();
    _reactionCtrl.close();
    _socket?.dispose();
    _socket = null;
  }
}
