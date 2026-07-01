import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../goals_notifier.dart';

class GoalDetailScreen extends ConsumerWidget {
  const GoalDetailScreen({super.key, required this.goalId});

  final String goalId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(goalDetailProvider(goalId));

    return Scaffold(
      body: state.when(
        data: (goal) => CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text(
                  goal.title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                background: goal.imageUrl != null
                    ? Image.network(goal.imageUrl!, fit: BoxFit.cover)
                    : _CategoryGradient(category: goal.category),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        _StatChip(
                          icon: Icons.people_outline,
                          label: '${goal.membersCount} a\'zo',
                        ),
                        const SizedBox(width: AppSpacing.space3),
                        _StatChip(
                          icon: Icons.article_outlined,
                          label: '${goal.postsCount} post',
                        ),
                        const Spacer(),
                        _CategoryBadge(category: goal.category),
                      ],
                    ),
                    if (goal.description != null &&
                        goal.description!.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.space4),
                      Text(
                        goal.description!,
                        style: AppTextStyles.bodyMd.copyWith(
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                    const SizedBox(height: AppSpacing.space5),
                    SizedBox(
                      width: double.infinity,
                      child: AppButton(
                        label: goal.isJoined
                            ? 'Maqsaddan chiqish'
                            : 'Maqsadga qo\'shilish',
                        variant: goal.isJoined
                            ? AppButtonVariant.outlined
                            : AppButtonVariant.primary,
                        onPressed: () => ref
                            .read(goalDetailProvider(goalId).notifier)
                            .toggleJoin(),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space4),
                    Divider(color: Theme.of(context).dividerColor),
                    const SizedBox(height: AppSpacing.space3),
                    Row(
                      children: [
                        const Icon(Icons.person_outline,
                            size: 16, color: AppColors.neutral400),
                        const SizedBox(width: 6),
                        Text(
                          'Yaratuvchi: ${goal.creatorName ?? goal.creatorId}',
                          style: AppTextStyles.bodySm,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        loading: () => const _DetailShimmer(),
        error: (e, _) => Scaffold(
          appBar: AppBar(),
          body: AppErrorState(
            message: e.toString().replaceFirst('Exception: ', ''),
            onRetry: () => ref.invalidate(goalDetailProvider(goalId)),
          ),
        ),
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: AppColors.neutral400),
        const SizedBox(width: 4),
        Text(label, style: AppTextStyles.bodySm),
      ],
    );
  }
}

class _CategoryBadge extends StatelessWidget {
  const _CategoryBadge({required this.category});
  final String category;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        category,
        style: AppTextStyles.bodySm.copyWith(color: AppColors.primary),
      ),
    );
  }
}

class _CategoryGradient extends StatelessWidget {
  const _CategoryGradient({required this.category});
  final String category;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary,
            AppColors.primary.withValues(alpha: 0.6),
          ],
        ),
      ),
    );
  }
}

class _DetailShimmer extends StatelessWidget {
  const _DetailShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: Column(
        children: [
          const ShimmerBox(width: double.infinity, height: 180),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Row(children: [
                  ShimmerBox(width: 90, height: 20),
                  SizedBox(width: AppSpacing.space3),
                  ShimmerBox(width: 70, height: 20),
                ]),
                SizedBox(height: AppSpacing.space4),
                ShimmerBox(width: double.infinity, height: 14),
                SizedBox(height: 6),
                ShimmerBox(width: 260, height: 14),
                SizedBox(height: AppSpacing.space5),
                ShimmerBox(width: double.infinity, height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
