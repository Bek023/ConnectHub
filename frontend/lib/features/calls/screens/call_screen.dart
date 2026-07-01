import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../call_provider.dart';
import '../call_webrtc_service.dart';

class CallScreen extends ConsumerWidget {
  const CallScreen({super.key, required this.callId});

  final String callId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(activeCallProvider);
    final webrtc = ref.read(callWebRtcServiceProvider);

    if (!state.isActive) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (context.mounted) context.pop();
      });
      return const SizedBox.shrink();
    }

    final call = state.call!;
    final isVideo = call.type == 'video' && !state.isVideoOff;

    return Scaffold(
      backgroundColor: AppColors.neutral950,
      body: Stack(
        fit: StackFit.expand,
        children: [
          if (isVideo)
            _RemoteVideoView(webrtc: webrtc)
          else
            _AudioCallBackground(state: state),
          if (isVideo && !state.isVideoOff)
            Positioned(
              top: 60,
              right: AppSpacing.space4,
              child: _LocalVideoPreview(renderer: webrtc.localRenderer),
            ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: _CallHeader(state: state),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _CallControls(
              state: state,
              isVideo: call.type == 'video',
              onMute: () =>
                  ref.read(activeCallProvider.notifier).toggleMute(),
              onVideo: () =>
                  ref.read(activeCallProvider.notifier).toggleVideo(),
              onFlip: () =>
                  ref.read(activeCallProvider.notifier).switchCamera(),
              onEnd: () async {
                await ref.read(activeCallProvider.notifier).end();
                if (context.mounted) context.pop();
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _AudioCallBackground extends StatelessWidget {
  const _AudioCallBackground({required this.state});

  final CallState state;

  @override
  Widget build(BuildContext context) {
    final other = state.participants.isNotEmpty ? state.participants.first : null;
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.neutral800, AppColors.neutral950],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppAvatar(
              imageUrl: other?.avatarUrl,
              name: other?.displayName ?? '?',
              size: AppAvatarSize.xl,
            ),
            const SizedBox(height: AppSpacing.space4),
            Text(
              other?.displayName ?? 'Qo\'ng\'iroq...',
              style: AppTextStyles.heading2.copyWith(
                color: AppColors.darkTextPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.space2),
            if (state.isConnecting)
              Text(
                'Ulanmoqda...',
                style: AppTextStyles.bodyMd.copyWith(
                  color: AppColors.neutral400,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _RemoteVideoView extends StatelessWidget {
  const _RemoteVideoView({required this.webrtc});

  final CallWebRtcService webrtc;

  @override
  Widget build(BuildContext context) {
    if (webrtc.remoteRenderers.isEmpty) {
      return Container(color: AppColors.neutral900);
    }
    final renderer = webrtc.remoteRenderers.values.first;
    return RTCVideoView(renderer, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover);
  }
}

class _LocalVideoPreview extends StatelessWidget {
  const _LocalVideoPreview({required this.renderer});

  final RTCVideoRenderer renderer;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: SizedBox(
        width: 100,
        height: 140,
        child: RTCVideoView(renderer, mirror: true),
      ),
    );
  }
}

class _CallHeader extends StatelessWidget {
  const _CallHeader({required this.state});

  final CallState state;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              state.isConnecting
                  ? 'Ulanmoqda...'
                  : '${state.participants.length + 1} ishtirokchi',
              style: AppTextStyles.bodySm.copyWith(
                color: AppColors.neutral400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CallControls extends StatelessWidget {
  const _CallControls({
    required this.state,
    required this.isVideo,
    required this.onMute,
    required this.onVideo,
    required this.onFlip,
    required this.onEnd,
  });

  final CallState state;
  final bool isVideo;
  final VoidCallback onMute;
  final VoidCallback onVideo;
  final VoidCallback onFlip;
  final VoidCallback onEnd;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.space8,
          AppSpacing.space4,
          AppSpacing.space8,
          AppSpacing.space8,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _ControlButton(
              icon: state.isMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
              active: !state.isMuted,
              onTap: onMute,
            ),
            if (isVideo)
              _ControlButton(
                icon: state.isVideoOff
                    ? Icons.videocam_off_rounded
                    : Icons.videocam_rounded,
                active: !state.isVideoOff,
                onTap: onVideo,
              ),
            if (isVideo && !state.isVideoOff)
              _ControlButton(
                icon: Icons.flip_camera_ios_rounded,
                active: true,
                onTap: onFlip,
              ),
            _ControlButton(
              icon: Icons.call_end_rounded,
              active: false,
              isEndCall: true,
              onTap: onEnd,
            ),
          ],
        ),
      ),
    );
  }
}

class _ControlButton extends StatelessWidget {
  const _ControlButton({
    required this.icon,
    required this.active,
    required this.onTap,
    this.isEndCall = false,
  });

  final IconData icon;
  final bool active;
  final bool isEndCall;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bg = isEndCall
        ? AppColors.error
        : active
            ? AppColors.neutral700
            : AppColors.neutral600;

    return GestureDetector(
      onTap: onTap,
      child: CircleAvatar(
        radius: 30,
        backgroundColor: bg,
        child: Icon(icon, color: Colors.white, size: 26),
      ),
    );
  }
}
