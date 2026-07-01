import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../call_model.dart';
import '../call_provider.dart';

class CallHistoryScreen extends ConsumerStatefulWidget {
  const CallHistoryScreen({super.key});

  @override
  ConsumerState<CallHistoryScreen> createState() => _CallHistoryScreenState();
}

class _CallHistoryScreenState extends ConsumerState<CallHistoryScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 100) {
      ref.read(callHistoryProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(callHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Qo\'ng\'iroqlar tarixi', style: AppTextStyles.heading3),
      ),
      body: state.when(
        data: (calls) {
          if (calls.isEmpty) {
            return const AppEmptyState(
              title: 'Qo\'ng\'iroqlar tarixi bo\'sh',
            );
          }
          return ListView.builder(
            controller: _scrollController,
            itemCount: calls.length,
            itemBuilder: (_, i) => _CallHistoryTile(call: calls[i]),
          );
        },
        loading: () => const _HistoryShimmer(),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(callHistoryProvider),
        ),
      ),
    );
  }
}

class _CallHistoryTile extends StatelessWidget {
  const _CallHistoryTile({required this.call});

  final CallModel call;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isVideo = call.type == 'video';
    final isEnded = call.status == 'ended';
    final duration = _duration(call.startedAt, call.endedAt);

    return ListTile(
      leading: AppAvatar(
        imageUrl: call.initiatorAvatarUrl,
        name: call.initiatorName ?? '?',
        size: AppAvatarSize.md,
      ),
      title: Text(
        call.initiatorName ?? 'Noma\'lum',
        style: AppTextStyles.labelLg.copyWith(
          color: scheme.onSurface,
        ),
      ),
      subtitle: Row(
        children: [
          Icon(
            isVideo ? Icons.videocam_outlined : Icons.call_outlined,
            size: 14,
            color: isEnded ? AppColors.neutral400 : AppColors.accentGreen,
          ),
          const SizedBox(width: 4),
          Text(
            isVideo ? 'Video qo\'ng\'iroq' : 'Ovozli qo\'ng\'iroq',
            style: AppTextStyles.bodySm.copyWith(
              color: AppColors.neutral400,
            ),
          ),
          if (duration != null) ...[
            Text(
              ' • $duration',
              style: AppTextStyles.bodySm.copyWith(
                color: AppColors.neutral400,
              ),
            ),
          ],
        ],
      ),
      trailing: Text(
        _formatDate(call.createdAt),
        style: AppTextStyles.bodySm.copyWith(
          color: AppColors.neutral400,
        ),
      ),
    );
  }

  String? _duration(String? start, String? end) {
    if (start == null || end == null) return null;
    try {
      final s = DateTime.parse(start);
      final e = DateTime.parse(end);
      final diff = e.difference(s);
      if (diff.inHours > 0) {
        return '${diff.inHours}s ${diff.inMinutes.remainder(60)}d';
      }
      return '${diff.inMinutes}d ${diff.inSeconds.remainder(60)}s';
    } catch (_) {
      return null;
    }
  }

  String _formatDate(String? date) {
    if (date == null) return '';
    try {
      return DateFormat('dd.MM HH:mm').format(DateTime.parse(date).toLocal());
    } catch (_) {
      return '';
    }
  }
}

class _HistoryShimmer extends StatelessWidget {
  const _HistoryShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: ListView.builder(
        itemCount: 6,
        itemBuilder: (_, i) => Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space4,
            vertical: AppSpacing.space2,
          ),
          child: Row(
            children: const [
              ShimmerCircle(size: 44),
              SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(width: 120, height: 14),
                    SizedBox(height: 6),
                    ShimmerBox(width: 80, height: 12),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
