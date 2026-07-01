import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'goal_model.dart';
import 'goals_repository.dart';

part 'goals_notifier.g.dart';

@riverpod
class TrendingGoals extends _$TrendingGoals {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<GoalModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref
        .read(goalsRepositoryProvider)
        .getTrending(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(goalsRepositoryProvider)
          .getTrending(page: _page, limit: _limit);
      _hasMore = more.length == _limit;
      state = AsyncData([...current, ...more]);
    } catch (_) {
      _page--;
    }
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    ref.invalidateSelf();
    await future;
  }

  void updateJoinStatus(String goalId, {required bool isJoined}) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.map((g) {
        if (g.id != goalId) return g;
        return g.copyWith(
          isJoined: isJoined,
          membersCount: isJoined ? g.membersCount + 1 : g.membersCount - 1,
        );
      }).toList(),
    );
  }
}

@riverpod
class MyGoals extends _$MyGoals {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<GoalModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref
        .read(goalsRepositoryProvider)
        .getMyGoals(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(goalsRepositoryProvider)
          .getMyGoals(page: _page, limit: _limit);
      _hasMore = more.length == _limit;
      state = AsyncData([...current, ...more]);
    } catch (_) {
      _page--;
    }
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    ref.invalidateSelf();
    await future;
  }

  void addGoal(GoalModel goal) {
    final current = state.valueOrNull ?? [];
    state = AsyncData([goal, ...current]);
  }

  void removeGoal(String goalId) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(current.where((g) => g.id != goalId).toList());
  }
}

@riverpod
class GoalDetail extends _$GoalDetail {
  @override
  Future<GoalModel> build(String goalId) async {
    return ref.read(goalsRepositoryProvider).getGoal(goalId);
  }

  Future<void> toggleJoin() async {
    final current = state.valueOrNull;
    if (current == null) return;

    final wasJoined = current.isJoined;
    state = AsyncData(current.copyWith(
      isJoined: !wasJoined,
      membersCount:
          wasJoined ? current.membersCount - 1 : current.membersCount + 1,
    ));

    try {
      final repo = ref.read(goalsRepositoryProvider);
      if (wasJoined) {
        await repo.leaveGoal(current.id);
        ref
            .read(myGoalsProvider.notifier)
            .removeGoal(current.id);
      } else {
        await repo.joinGoal(current.id);
        ref
            .read(myGoalsProvider.notifier)
            .addGoal(state.valueOrNull!);
      }
      ref.read(trendingGoalsProvider.notifier).updateJoinStatus(
            current.id,
            isJoined: !wasJoined,
          );
    } catch (_) {
      state = AsyncData(current);
    }
  }
}
