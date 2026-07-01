import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'call_model.dart';
import 'call_socket_service.dart';
import 'call_webrtc_service.dart';
import 'calls_repository.dart';

part 'call_provider.g.dart';

class CallState {
  const CallState({
    this.call,
    this.isConnecting = false,
    this.isConnected = false,
    this.isMuted = false,
    this.isVideoOff = false,
    this.participants = const [],
    this.error,
  });

  final CallModel? call;
  final bool isConnecting;
  final bool isConnected;
  final bool isMuted;
  final bool isVideoOff;
  final List<CallParticipantModel> participants;
  final String? error;

  bool get isActive => call != null && (isConnecting || isConnected);

  CallState copyWith({
    CallModel? call,
    bool clearCall = false,
    bool? isConnecting,
    bool? isConnected,
    bool? isMuted,
    bool? isVideoOff,
    List<CallParticipantModel>? participants,
    String? error,
  }) {
    return CallState(
      call: clearCall ? null : call ?? this.call,
      isConnecting: isConnecting ?? this.isConnecting,
      isConnected: isConnected ?? this.isConnected,
      isMuted: isMuted ?? this.isMuted,
      isVideoOff: isVideoOff ?? this.isVideoOff,
      participants: participants ?? this.participants,
      error: error,
    );
  }
}

@Riverpod(keepAlive: true)
class ActiveCall extends _$ActiveCall {
  StreamSubscription<Map<String, dynamic>>? _joinedSub;
  StreamSubscription<Map<String, dynamic>>? _leftSub;
  StreamSubscription<Map<String, dynamic>>? _endedSub;

  @override
  CallState build() {
    ref.onDispose(_cleanup);
    return const CallState();
  }

  Future<void> initiate({
    required String chatId,
    required String callType,
  }) async {
    state = state.copyWith(isConnecting: true, error: null);
    try {
      final webrtc = ref.read(callWebRtcServiceProvider);
      final socket = ref.read(callSocketServiceProvider);

      await webrtc.startLocalStream(withVideo: callType == 'video');
      final call = await ref
          .read(callsRepositoryProvider)
          .initiateCall(chatId: chatId, type: callType);

      await socket.connect();
      state = state.copyWith(
        call: call,
        isVideoOff: callType == 'audio',
        participants: call.participants,
      );
      await _setupSignaling(call.id);
    } catch (e) {
      ref.read(callWebRtcServiceProvider).stopLocalStream();
      state = state.copyWith(
        isConnecting: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> join(CallModel incomingCall) async {
    state = state.copyWith(isConnecting: true, error: null);
    try {
      final webrtc = ref.read(callWebRtcServiceProvider);
      final socket = ref.read(callSocketServiceProvider);

      await webrtc.startLocalStream(withVideo: incomingCall.type == 'video');
      final call = await ref
          .read(callsRepositoryProvider)
          .joinCall(incomingCall.id);

      await socket.connect();
      state = state.copyWith(
        call: call,
        isVideoOff: incomingCall.type == 'audio',
        participants: call.participants,
      );
      await _setupSignaling(call.id);
    } catch (e) {
      ref.read(callWebRtcServiceProvider).stopLocalStream();
      state = state.copyWith(
        isConnecting: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> _setupSignaling(String callId) async {
    final socket = ref.read(callSocketServiceProvider);

    _joinedSub = socket.userJoined.listen((data) {
      final userId = data['userId'] as String?;
      if (userId == null) return;
      final current = state.participants;
      if (current.any((p) => p.userId == userId)) return;
      state = state.copyWith(
        participants: [
          ...current,
          CallParticipantModel(
            userId: userId,
            displayName: data['displayName'] as String? ?? userId,
            avatarUrl: data['avatarUrl'] as String?,
          ),
        ],
      );
    });

    _leftSub = socket.userLeft.listen((data) {
      final userId = data['userId'] as String?;
      if (userId == null) return;
      ref.read(callWebRtcServiceProvider).removeRemoteStream(userId);
      state = state.copyWith(
        participants: state.participants
            .where((p) => p.userId != userId)
            .toList(),
      );
    });

    _endedSub = socket.callEnded.listen((_) => _onCallEnded());

    await socket.joinCallRoom(callId);
    state = state.copyWith(isConnecting: false, isConnected: true);
  }

  void _onCallEnded() {
    ref.read(callWebRtcServiceProvider).stopLocalStream();
    _cleanup();
    state = const CallState();
  }

  Future<void> leave() async {
    final callId = state.call?.id;
    if (callId == null) return;
    ref.read(callSocketServiceProvider).leaveCallRoom(callId);
    ref.read(callWebRtcServiceProvider).stopLocalStream();
    try {
      await ref.read(callsRepositoryProvider).leaveCall(callId);
    } catch (_) {}
    _cleanup();
    state = const CallState();
  }

  Future<void> end() async {
    final callId = state.call?.id;
    if (callId == null) return;
    ref.read(callSocketServiceProvider).endCallSignal(callId);
    ref.read(callWebRtcServiceProvider).stopLocalStream();
    try {
      await ref.read(callsRepositoryProvider).endCall(callId);
    } catch (_) {}
    _cleanup();
    state = const CallState();
  }

  void toggleMute() {
    final muted = !state.isMuted;
    ref.read(callWebRtcServiceProvider).muteLocalAudio(muted);
    state = state.copyWith(isMuted: muted);
  }

  void toggleVideo() {
    final off = !state.isVideoOff;
    ref.read(callWebRtcServiceProvider).toggleLocalVideo(off);
    state = state.copyWith(isVideoOff: off);
  }

  Future<void> switchCamera() =>
      ref.read(callWebRtcServiceProvider).switchCamera();

  void _cleanup() {
    _joinedSub?.cancel();
    _leftSub?.cancel();
    _endedSub?.cancel();
    _joinedSub = _leftSub = _endedSub = null;
  }
}

@riverpod
class CallHistory extends _$CallHistory {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<CallModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref.read(callsRepositoryProvider).getHistory(page: 1);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more =
          await ref.read(callsRepositoryProvider).getHistory(page: _page);
      _hasMore = more.length == _limit;
      state = AsyncData([...current, ...more]);
    } catch (_) {
      _page--;
    }
  }
}
