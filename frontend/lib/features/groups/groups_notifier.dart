import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'group_model.dart';
import 'groups_repository.dart';

part 'groups_notifier.g.dart';

class GroupDetailState {
  const GroupDetailState({
    required this.group,
    this.members = const [],
    this.nextCursor,
    this.hasMoreMembers = false,
  });

  final GroupModel group;
  final List<GroupMemberModel> members;
  final String? nextCursor;
  final bool hasMoreMembers;

  GroupDetailState copyWith({
    GroupModel? group,
    List<GroupMemberModel>? members,
    Object? nextCursor = _sentinel,
    bool? hasMoreMembers,
  }) {
    return GroupDetailState(
      group: group ?? this.group,
      members: members ?? this.members,
      nextCursor:
          nextCursor == _sentinel ? this.nextCursor : nextCursor as String?,
      hasMoreMembers: hasMoreMembers ?? this.hasMoreMembers,
    );
  }

  static const _sentinel = Object();
}

@riverpod
class MyGroups extends _$MyGroups {
  static const _limit = 20;
  var _page = 1;
  var _hasMore = true;

  @override
  Future<List<GroupModel>> build() async {
    _page = 1;
    _hasMore = true;
    return ref
        .read(groupsRepositoryProvider)
        .getMyGroups(page: 1, limit: _limit);
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    final current = state.valueOrNull ?? [];
    _page++;
    try {
      final more = await ref
          .read(groupsRepositoryProvider)
          .getMyGroups(page: _page, limit: _limit);
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

  void addGroup(GroupModel group) {
    final current = state.valueOrNull ?? [];
    state = AsyncData([group, ...current]);
  }

  void removeGroup(String groupId) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(current.where((g) => g.id != groupId).toList());
  }
}

@riverpod
class GroupDetail extends _$GroupDetail {
  @override
  Future<GroupDetailState> build(String groupId) async {
    final repo = ref.read(groupsRepositoryProvider);
    final group = await repo.getGroup(groupId);
    final result = await repo.getMembers(groupId);
    return GroupDetailState(
      group: group,
      members: result.members,
      nextCursor: result.nextCursor,
      hasMoreMembers: result.hasMore,
    );
  }

  Future<void> loadMoreMembers() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMoreMembers) return;
    final result = await ref
        .read(groupsRepositoryProvider)
        .getMembers(current.group.id, cursor: current.nextCursor);
    state = AsyncData(current.copyWith(
      members: [...current.members, ...result.members],
      nextCursor: result.nextCursor,
      hasMoreMembers: result.hasMore,
    ));
  }

  Future<void> toggleJoin() async {
    final current = state.valueOrNull;
    if (current == null) return;
    final wasJoined = current.group.isJoined;
    state = AsyncData(current.copyWith(
      group: current.group.copyWith(
        isJoined: !wasJoined,
        membersCount: wasJoined
            ? current.group.membersCount - 1
            : current.group.membersCount + 1,
      ),
    ));
    try {
      final repo = ref.read(groupsRepositoryProvider);
      if (wasJoined) {
        await repo.leaveGroup(current.group.id);
        ref.read(myGroupsProvider.notifier).removeGroup(current.group.id);
      } else {
        final updated = await repo.joinGroup(current.group.id);
        state = AsyncData(current.copyWith(group: updated));
        ref.read(myGroupsProvider.notifier).addGroup(updated);
      }
    } catch (_) {
      state = AsyncData(current);
    }
  }

  Future<void> updateMemberRole(String userId, String role) async {
    final current = state.valueOrNull;
    if (current == null) return;
    await ref
        .read(groupsRepositoryProvider)
        .updateMemberRole(current.group.id, userId, role);
    state = AsyncData(current.copyWith(
      members: current.members
          .map((m) => m.id == userId ? m.copyWith(role: role) : m)
          .toList(),
    ));
  }

  Future<void> removeMember(String userId) async {
    final current = state.valueOrNull;
    if (current == null) return;
    await ref
        .read(groupsRepositoryProvider)
        .removeMember(current.group.id, userId);
    state = AsyncData(current.copyWith(
      members: current.members.where((m) => m.id != userId).toList(),
      group: current.group.copyWith(
        membersCount: current.group.membersCount - 1,
      ),
    ));
  }
}
