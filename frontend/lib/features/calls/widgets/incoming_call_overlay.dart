import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../call_model.dart';
import '../call_provider.dart';

class IncomingCallOverlay extends ConsumerWidget {
  const IncomingCallOverlay({super.key, required this.call});

  final CallModel call;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Material(
      color: Colors.transparent,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.space4),
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.space4),
            decoration: BoxDecoration(
              color: AppColors.neutral800,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.4),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    AppAvatar(
                      imageUrl: call.initiatorAvatarUrl,
                      name: call.initiatorName ?? 'Noma\'lum',
                      size: AppAvatarSize.lg,
                    ),
                    const SizedBox(width: AppSpacing.space3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            call.initiatorName ?? 'Noma\'lum',
                            style: AppTextStyles.labelLg.copyWith(
                              color: AppColors.darkTextPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            call.type == 'video'
                                ? 'Video qo\'ng\'iroq...'
                                : 'Ovozli qo\'ng\'iroq...',
                            style: AppTextStyles.bodySm.copyWith(
                              color: AppColors.neutral400,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      call.type == 'video'
                          ? Icons.videocam_outlined
                          : Icons.call_outlined,
                      color: AppColors.neutral400,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.space5),
                Row(
                  children: [
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.call_end_rounded,
                        color: AppColors.error,
                        label: 'Rad etish',
                        onTap: () => _decline(context, ref),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.space3),
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.call_rounded,
                        color: AppColors.accentGreen,
                        label: 'Qabul qilish',
                        onTap: () => _accept(context, ref),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _accept(BuildContext context, WidgetRef ref) async {
    await ref.read(activeCallProvider.notifier).join(call);
    if (context.mounted) {
      context.push(AppRoutes.callScreenRoute(call.id));
    }
  }

  void _decline(BuildContext context, WidgetRef ref) {
    ref.read(activeCallProvider.notifier).leave();
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.color,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final Color color;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: color,
            child: Icon(icon, color: Colors.white, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: AppTextStyles.bodySm.copyWith(
              color: AppColors.neutral400,
            ),
          ),
        ],
      ),
    );
  }
}
