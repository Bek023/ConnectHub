import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'call_webrtc_service.g.dart';

@Riverpod(keepAlive: true)
CallWebRtcService callWebRtcService(Ref ref) {
  final service = CallWebRtcService();
  ref.onDispose(service.dispose);
  return service;
}

class CallWebRtcService {
  MediaStream? localStream;
  final Map<String, MediaStream> remoteStreams = {};

  final localRenderer = RTCVideoRenderer();
  final Map<String, RTCVideoRenderer> remoteRenderers = {};

  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;
    await localRenderer.initialize();
    _initialized = true;
  }

  Future<void> startLocalStream({required bool withVideo}) async {
    await initialize();
    final constraints = <String, dynamic>{
      'audio': true,
      'video': withVideo
          ? {'facingMode': 'user', 'width': 640, 'height': 480}
          : false,
    };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    localRenderer.srcObject = localStream;
  }

  Future<RTCVideoRenderer> addRemoteStream(
      String userId, MediaStream stream) async {
    final renderer = RTCVideoRenderer();
    await renderer.initialize();
    renderer.srcObject = stream;
    remoteStreams[userId] = stream;
    remoteRenderers[userId] = renderer;
    return renderer;
  }

  void removeRemoteStream(String userId) {
    remoteStreams.remove(userId);
    remoteRenderers[userId]?.dispose();
    remoteRenderers.remove(userId);
  }

  void muteLocalAudio(bool mute) {
    localStream?.getAudioTracks().forEach((t) => t.enabled = !mute);
  }

  void toggleLocalVideo(bool off) {
    localStream?.getVideoTracks().forEach((t) => t.enabled = !off);
  }

  Future<void> switchCamera() async {
    final tracks = localStream?.getVideoTracks();
    if (tracks == null || tracks.isEmpty) return;
    await Helper.switchCamera(tracks.first);
  }

  void stopLocalStream() {
    localStream?.getTracks().forEach((t) => t.stop());
    localStream = null;
    localRenderer.srcObject = null;
  }

  void dispose() {
    stopLocalStream();
    localRenderer.dispose();
    for (final r in remoteRenderers.values) {
      r.dispose();
    }
    remoteRenderers.clear();
    remoteStreams.clear();
    _initialized = false;
  }
}
