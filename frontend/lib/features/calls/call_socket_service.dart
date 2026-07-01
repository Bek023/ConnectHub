import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/core_providers.dart';
import '../../core/socket/socket_client.dart';
import '../../core/socket/socket_events.dart';
import '../../core/storage/secure_storage.dart';

part 'call_socket_service.g.dart';

@Riverpod(keepAlive: true)
CallSocketService callSocketService(Ref ref) {
  final storage = ref.watch(secureStorageProvider);
  final service = CallSocketService(storage);
  ref.onDispose(service.dispose);
  return service;
}

class CallSocketService {
  CallSocketService(this._storage);

  final SecureStorage _storage;
  SocketClient? _socket;

  final _userJoinedCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _userLeftCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _newProducerCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _callEndedCtrl =
      StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get userJoined => _userJoinedCtrl.stream;
  Stream<Map<String, dynamic>> get userLeft => _userLeftCtrl.stream;
  Stream<Map<String, dynamic>> get newProducer => _newProducerCtrl.stream;
  Stream<Map<String, dynamic>> get callEnded => _callEndedCtrl.stream;

  Future<void> connect() async {
    if (_socket != null) return;
    final token = await _storage.readAccessToken();
    if (token == null) return;
    _socket = SocketClient.connect(
      namespace: '/calls',
      accessToken: token,
    );
    _socket!.on(SocketEvents.userJoinedCall, (d) {
      if (d is Map<String, dynamic>) _userJoinedCtrl.add(d);
    });
    _socket!.on(SocketEvents.userLeftCall, (d) {
      if (d is Map<String, dynamic>) _userLeftCtrl.add(d);
    });
    _socket!.on(SocketEvents.newProducer, (d) {
      if (d is Map<String, dynamic>) _newProducerCtrl.add(d);
    });
    _socket!.on(SocketEvents.callEnded, (d) {
      if (d is Map<String, dynamic>) _callEndedCtrl.add(d);
    });
  }

  Future<Map<String, dynamic>> joinCallRoom(String callId) {
    final completer = Completer<Map<String, dynamic>>();
    _socket?.emit(
      SocketEvents.joinCallRoom,
      {'callId': callId},
    );
    _socket?.on('joinCallRoomResponse', (data) {
      if (!completer.isCompleted && data is Map<String, dynamic>) {
        completer.complete(data);
      }
    });
    return completer.future.timeout(const Duration(seconds: 10));
  }

  void leaveCallRoom(String callId) =>
      _socket?.emit(SocketEvents.leaveCallRoom, {'callId': callId});

  Future<Map<String, dynamic>> createTransport(
      String callId, String direction) {
    final completer = Completer<Map<String, dynamic>>();
    _socket?.emit(
      SocketEvents.createTransport,
      {'callId': callId, 'direction': direction},
    );
    _socket?.on('createTransportResponse', (data) {
      if (!completer.isCompleted && data is Map<String, dynamic>) {
        completer.complete(data);
      }
    });
    return completer.future.timeout(const Duration(seconds: 10));
  }

  void connectTransport(String transportId, Map<String, dynamic> dtlsParameters) =>
      _socket?.emit(SocketEvents.connectTransport, {
        'transportId': transportId,
        'dtlsParameters': dtlsParameters,
      });

  Future<Map<String, dynamic>> produce(
      String callId, String transportId, Map<String, dynamic> rtpParameters, String kind) {
    final completer = Completer<Map<String, dynamic>>();
    _socket?.emit(SocketEvents.produce, {
      'callId': callId,
      'transportId': transportId,
      'kind': kind,
      'rtpParameters': rtpParameters,
    });
    _socket?.on('produceResponse', (data) {
      if (!completer.isCompleted && data is Map<String, dynamic>) {
        completer.complete(data);
      }
    });
    return completer.future.timeout(const Duration(seconds: 10));
  }

  Future<List<Map<String, dynamic>>> getProducers(String callId) {
    final completer = Completer<List<Map<String, dynamic>>>();
    _socket?.emit(SocketEvents.getProducers, {'callId': callId});
    _socket?.on('getProducersResponse', (data) {
      if (!completer.isCompleted && data is List) {
        completer.complete(data.cast<Map<String, dynamic>>());
      }
    });
    return completer.future.timeout(const Duration(seconds: 10));
  }

  void endCallSignal(String callId) =>
      _socket?.emit(SocketEvents.endCall, {'callId': callId});

  void dispose() {
    _userJoinedCtrl.close();
    _userLeftCtrl.close();
    _newProducerCtrl.close();
    _callEndedCtrl.close();
    _socket?.dispose();
    _socket = null;
  }
}
