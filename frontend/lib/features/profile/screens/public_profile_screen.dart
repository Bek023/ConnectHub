import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_text_styles.dart';
import '../../../platforms/web/web_seo.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../../../core/theme/app_spacing.dart';
import '../../auth/auth_notifier.dart';
import '../profile_provider.dart';
import '../widgets/profile_header.dart';

class PublicProfileScreen extends ConsumerWidget {
  const PublicProfileScreen({super.key, required this.userId});

  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(publicProfileProvider(userId));
    final currentUserId = ref.watch(authProvider).valueOrNull?.id ?? '';
    final isOwn = currentUserId == userId;

    return Scaffold(
      appBar: AppBar(
        title: state.whenOrNull(
              data: (p) => Text(
                p.username != null ? '@${p.username}' : p.displayName,
                style: AppTextStyles.heading3,
              ),
            ) ??
            const Text('Profil'),
      ),
      body: state.when(
        data: (profile) {
          if (profile.username != null) {
            SeoService.setProfileMeta(
              profile.username!,
              profile.bio ?? '',
              profile.avatarUrl ?? '',
            );
          }
          return RefreshIndicator(
            onRefresh: () async =>
                ref.invalidate(publicProfileProvider(userId)),
            child: ListView(
              children: [
                ProfileHeader(
                  profile: profile,
                  isOwn: isOwn,
                ),
                const Divider(),
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.space4),
                  child: Text(
                    'So\'nggi faollik',
                    style: AppTextStyles.labelLg.copyWith(
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.space8),
                  child: Center(
                    child: Text(
                      'Hali hech qanday faollik yo\'q',
                      style: AppTextStyles.bodyMd.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withValues(alpha: 0.4),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const _PublicProfileShimmer(),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(publicProfileProvider(userId)),
        ),
      ),
    );
  }
}

class _PublicProfileShimmer extends StatelessWidget {
  const _PublicProfileShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Row(
              children: [
                ShimmerCircle(size: 80),
                SizedBox(width: AppSpacing.space5),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Column(children: [
                        ShimmerBox(width: 36, height: 18),
                        SizedBox(height: 4),
                        ShimmerBox(width: 36, height: 12),
                      ]),
                      Column(children: [
                        ShimmerBox(width: 36, height: 18),
                        SizedBox(height: 4),
                        ShimmerBox(width: 36, height: 12),
                      ]),
                      Column(children: [
                        ShimmerBox(width: 36, height: 18),
                        SizedBox(height: 4),
                        ShimmerBox(width: 36, height: 12),
                      ]),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: AppSpacing.space3),
            ShimmerBox(width: 140, height: 16),
            SizedBox(height: 6),
            ShimmerBox(width: 100, height: 12),
            SizedBox(height: AppSpacing.space2),
            ShimmerBox(width: double.infinity, height: 12),
            SizedBox(height: AppSpacing.space4),
            ShimmerBox(width: double.infinity, height: 40),
          ],
        ),
      ),
    );
  }
}
