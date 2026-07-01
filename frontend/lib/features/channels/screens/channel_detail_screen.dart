import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../channel_detail_notifier.dart';
import '../channel_model.dart';

class ChannelDetailScreen extends ConsumerStatefulWidget {
  const ChannelDetailScreen({super.key, required this.channelId});

  final String channelId;

  @override
  ConsumerState<ChannelDetailScreen> createState() =>
      _ChannelDetailScreenState();
}

class _ChannelDetailScreenState extends ConsumerState<ChannelDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(channelDetailProvider(widget.channelId).notifier).loadStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(channelDetailProvider(widget.channelId));

    return Scaffold(
      body: state.when(
        data: (data) => CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 160,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text(
                  data.channel.name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                background: data.channel.coverUrl != null
                    ? Image.network(data.channel.coverUrl!, fit: BoxFit.cover)
                    : _CoverGradient(),
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
                        AppAvatar(
                          imageUrl: data.channel.avatarUrl,
                          name: data.channel.name,
                          size: AppAvatarSize.lg,
                        ),
                        const SizedBox(width: AppSpacing.space3),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _StatRow(
                                icon: Icons.person_outline,
                                label: '${data.channel.subscribersCount} obunachi',
                              ),
                              _StatRow(
                                icon: Icons.article_outlined,
                                label: '${data.channel.postsCount} post',
                              ),
                              if (data.channel.category != null)
                                _StatRow(
                                  icon: Icons.category_outlined,
                                  label: data.channel.category!,
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    if (data.channel.description != null &&
                        data.channel.description!.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.space3),
                      Text(
                        data.channel.description!,
                        style: AppTextStyles.bodyMd.copyWith(
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                    const SizedBox(height: AppSpacing.space4),
                    if (!data.channel.isOwner)
                      SizedBox(
                        width: double.infinity,
                        child: AppButton(
                          label: data.channel.isSubscribed
                              ? 'Obunani bekor qilish'
                              : 'Obuna bo\'lish',
                          variant: data.channel.isSubscribed
                              ? AppButtonVariant.outlined
                              : AppButtonVariant.primary,
                          onPressed: () => ref
                              .read(channelDetailProvider(widget.channelId)
                                  .notifier)
                              .toggleSubscribe(),
                        ),
                      ),
                    if (data.channel.isOwner && data.stats != null) ...[
                      const SizedBox(height: AppSpacing.space4),
                      _StatsSection(stats: data.stats!),
                    ],
                    if (data.channel.isOwner && data.statsLoading)
                      const Padding(
                        padding: EdgeInsets.symmetric(
                            vertical: AppSpacing.space4),
                        child: Center(
                            child:
                                CircularProgressIndicator(strokeWidth: 2)),
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
            onRetry: () =>
                ref.invalidate(channelDetailProvider(widget.channelId)),
          ),
        ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  const _StatRow({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppColors.neutral400),
          const SizedBox(width: 6),
          Text(label, style: AppTextStyles.bodySm),
        ],
      ),
    );
  }
}

class _StatsSection extends StatelessWidget {
  const _StatsSection({required this.stats});
  final ChannelStatsModel stats;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Divider(color: Theme.of(context).dividerColor),
        const SizedBox(height: AppSpacing.space2),
        Text('Statistika', style: AppTextStyles.labelLg),
        const SizedBox(height: AppSpacing.space3),
        Row(
          children: [
            Expanded(
              child: _StatCard(
                label: 'Jami obunachi',
                value: _fmt(stats.totalSubscribers),
                icon: Icons.people_outline,
              ),
            ),
            const SizedBox(width: AppSpacing.space3),
            Expanded(
              child: _StatCard(
                label: 'Jami ko\'rishlar',
                value: _fmt(stats.totalViews),
                icon: Icons.visibility_outlined,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3),
        Row(
          children: [
            Expanded(
              child: _StatCard(
                label: 'Bugun yangi',
                value: '+${stats.newSubscribersToday}',
                icon: Icons.trending_up,
                positive: true,
              ),
            ),
            const SizedBox(width: AppSpacing.space3),
            Expanded(
              child: _StatCard(
                label: 'Bu hafta postlar',
                value: '${stats.postsThisWeek}',
                icon: Icons.article_outlined,
              ),
            ),
          ],
        ),
      ],
    );
  }

  String _fmt(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    this.positive = false,
  });

  final String label;
  final String value;
  final IconData icon;
  final bool positive;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.space3),
      decoration: BoxDecoration(
        color: Theme.of(context).dividerColor,
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 20,
            color:
                positive ? AppColors.accentGreen : AppColors.neutral400,
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppTextStyles.heading3.copyWith(
              color: positive ? AppColors.accentGreen : null,
            ),
          ),
          Text(label, style: AppTextStyles.bodySm),
        ],
      ),
    );
  }
}

class _CoverGradient extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF14B8A6), Color(0xFF6C63FF)],
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
          const ShimmerBox(width: double.infinity, height: 160),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Row(children: [
                  ShimmerCircle(size: 56),
                  SizedBox(width: AppSpacing.space3),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ShimmerBox(width: 140, height: 12),
                      SizedBox(height: 6),
                      ShimmerBox(width: 100, height: 12),
                    ],
                  ),
                ]),
                SizedBox(height: AppSpacing.space4),
                ShimmerBox(width: double.infinity, height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
