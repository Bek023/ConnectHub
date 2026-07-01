import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../platforms/web/web_seo.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../../auth/auth_notifier.dart';
import '../profile_provider.dart';
import '../widgets/profile_header.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(myProfileProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Profil', style: AppTextStyles.heading3),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_outlined),
            onPressed: () => _confirmLogout(context, ref),
          ),
        ],
      ),
      body: state.when(
        data: (profile) {
          SeoService.setProfileMeta(
            profile.username ?? profile.displayName,
            profile.bio ?? '',
            profile.avatarUrl ?? '',
          );
          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(myProfileProvider),
            child: ListView(
              children: [
                ProfileHeader(
                  profile: profile,
                  isOwn: true,
                  onEdit: () => context.push(AppRoutes.editProfile),
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
                const _EmptyActivity(),
              ],
            ),
          );
        },
        loading: () => const _ProfileShimmer(),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(myProfileProvider),
        ),
      ),
    );
  }

  void _confirmLogout(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Chiqish'),
        content: const Text('Hisobdan chiqishni tasdiqlaysizmi?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Bekor qilish'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await ref.read(authProvider.notifier).logout();
            },
            child: const Text('Chiqish'),
          ),
        ],
      ),
    );
  }
}

class _EmptyActivity extends StatelessWidget {
  const _EmptyActivity();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space8),
      child: Center(
        child: Text(
          'Hali hech qanday faollik yo\'q',
          style: AppTextStyles.bodyMd.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4),
          ),
        ),
      ),
    );
  }
}

class _ProfileShimmer extends StatelessWidget {
  const _ProfileShimmer();

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
                      _StatShimmer(),
                      _StatShimmer(),
                      _StatShimmer(),
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
            SizedBox(height: 4),
            ShimmerBox(width: 200, height: 12),
            SizedBox(height: AppSpacing.space4),
            ShimmerBox(width: double.infinity, height: 40),
          ],
        ),
      ),
    );
  }
}

class _StatShimmer extends StatelessWidget {
  const _StatShimmer();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        ShimmerBox(width: 36, height: 18),
        SizedBox(height: 4),
        ShimmerBox(width: 36, height: 12),
      ],
    );
  }
}
