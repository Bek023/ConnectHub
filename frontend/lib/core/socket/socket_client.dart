import 'package:socket_io_client/socket_io_client.dart' as io;

import '../api/api_endpoints.dart';

/// `/chat`, `/calls`, `/notifications` namespace'lari uchun socket.io wrapper.
/// Manba: API_DOCS.md > bo'lim 5, 10, 12.
class SocketClient {
  SocketClient._(this._socket);

  final io.Socket _socket;
  io.Socket get socket => _socket;

  bool get connected => _socket.connected;

  /// [namespace] — masalan [ApiEndpoints.wsChatNamespace].
  /// [accessToken] — auth handshake uchun (`setAuth({'token': accessToken})`).
  /// [tokenProvider] — reconnect oldidan yangi access token o'qish uchun.
  static SocketClient connect({
    required String namespace,
    required String accessToken,
    Future<String?> Function()? tokenProvider,
  }) {
    final socket = io.io(
      '${ApiEndpoints.wsUrl}$namespace',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': accessToken})
          .build(),
    );

    final client = SocketClient._(socket);

    if (tokenProvider != null) {
      socket.io.on('reconnect_attempt', (_) async {
        final token = await tokenProvider();
        if (token != null) client.updateAuth(token);
      });
    }

    socket.connect();
    return client;
  }

  void updateAuth(String token) {
    _socket.auth = {'token': token};
  }

  void onConnect(void Function() handler) =>
      _socket.onConnect((_) => handler());

  void on(String event, void Function(dynamic data) handler) =>
      _socket.on(event, handler);

  void off(String event) => _socket.off(event);

  void emit(String event, [dynamic data]) => _socket.emit(event, data);

  void dispose() {
    _socket.clearListeners();
    _socket.disconnect();
    _socket.dispose();
  }
}
