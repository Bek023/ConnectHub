import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../goals_notifier.dart';
import '../widgets/goal_card.dart';

class GoalsScreen extends ConsumerWidget {
  const GoalsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Maqsadlar'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Trend'),
              Tab(text: 'Mening'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => context.push(AppRoutes.createGoal),
            ),
          ],
        ),
        body: const TabBarView(
          children: [
            _TrendingTab(),
            _MyGoalsTab(),
          ],
        ),
      ),
    );
  }
}

class _TrendingTab extends ConsumerStatefulWidget {
  const _TrendingTab();

  @override
  ConsumerState<_TrendingTab> createState() => _TrendingTabState();
}

class _TrendingTabState extends ConsumerState<_TrendingTab> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 300) {
        ref.read(trendingGoalsProvider.notifier).loadMore();
      }
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(trendingGoalsProvider);
    return state.when(
      data: (goals) {
        if (goals.isEmpty) {
          return AppEmptyState(
            icon: Icons.flag_outlined,
            title: 'Hali maqsadlar yo\'q',
            subtitle: 'Birinchi bo\'lib maqsad yarating',
          );
        }
        return RefreshIndicator(
          onRefresh: () =>
              ref.read(trendingGoalsProvider.notifier).refresh(),
          child: ListView.builder(
            controller: _scroll,
            padding: const EdgeInsets.all(AppSpacing.space4),
            itemCount: goals.length,
            itemBuilder: (ctx, i) {
              final goal = goals[i];
              return GoalCard(
                goal: goal,
                onTap: () => context.push(AppRoutes.goalDetailRoute(goal.id)),
                onJoin: () => ref
                    .read(goalDetailProvider(goal.id).notifier)
                    .toggleJoin(),
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => AppErrorState(
        message: e.toString().replaceFirst('Exception: ', ''),
        onRetry: () => ref.invalidate(trendingGoalsProvider),
      ),
    );
  }
}

class _MyGoalsTab extends ConsumerWidget {
  const _MyGoalsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(myGoalsProvider);
    return state.when(
      data: (goals) {
        if (goals.isEmpty) {
          return AppEmptyState(
            icon: Icons.flag_outlined,
            title: 'Hech qanday maqsadga qo\'shilmagansiz',
            subtitle: 'Trend maqsadlardan birini tanlang',
          );
        }
        return RefreshIndicator(
          onRefresh: () => ref.read(myGoalsProvider.notifier).refresh(),
          child: ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.space4),
            itemCount: goals.length,
            itemBuilder: (ctx, i) {
              final goal = goals[i];
              return GoalCard(
                goal: goal,
                onTap: () => context.push(AppRoutes.goalDetailRoute(goal.id)),
                onJoin: () => ref
                    .read(goalDetailProvider(goal.id).notifier)
                    .toggleJoin(),
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => AppErrorState(
        message: e.toString().replaceFirst('Exception: ', ''),
        onRetry: () => ref.invalidate(myGoalsProvider),
      ),
    );
  }
}
