import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_empty_state.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../groups_notifier.dart';
import '../widgets/group_card.dart';

class GroupsScreen extends ConsumerStatefulWidget {
  const GroupsScreen({super.key});

  @override
  ConsumerState<GroupsScreen> createState() => _GroupsScreenState();
}

class _GroupsScreenState extends ConsumerState<GroupsScreen> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 300) {
        ref.read(myGroupsProvider.notifier).loadMore();
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
    final state = ref.watch(myGroupsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guruhlar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner_outlined),
            tooltip: 'Kod bilan qo\'shilish',
            onPressed: () => context.push(AppRoutes.joinGroupByCode),
          ),
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Guruh yaratish',
            onPressed: () => context.push(AppRoutes.createGroup),
          ),
        ],
      ),
      body: state.when(
        data: (groups) {
          if (groups.isEmpty) {
            return AppEmptyState(
              icon: Icons.group_outlined,
              title: 'Hali guruhlar yo\'q',
              subtitle: 'Yangi guruh yarating yoki kodni kiritib qo\'shiling',
              actionLabel: 'Guruh yaratish',
              onAction: () => context.push(AppRoutes.createGroup),
            );
          }
          return RefreshIndicator(
            onRefresh: () => ref.read(myGroupsProvider.notifier).refresh(),
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(AppSpacing.space4),
              itemCount: groups.length,
              itemBuilder: (ctx, i) {
                final group = groups[i];
                return GroupCard(
                  group: group,
                  onTap: () =>
                      context.push(AppRoutes.groupDetailRoute(group.id)),
                );
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => AppErrorState(
          message: e.toString().replaceFirst('Exception: ', ''),
          onRetry: () => ref.invalidate(myGroupsProvider),
        ),
      ),
    );
  }
}
