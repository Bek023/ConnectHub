import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../../auth/auth_notifier.dart';
import '../groups_notifier.dart';
import '../widgets/member_tile.dart';

class GroupDetailScreen extends ConsumerWidget {
  const GroupDetailScreen({super.key, required this.groupId});

  final String groupId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(groupDetailProvider(groupId));
    final currentUserId = ref.watch(authProvider).valueOrNull?.id ?? '';

    return Scaffold(
      body: state.when(
        data: (data) {
          final group = data.group;
          final canManage =
              group.myRole == 'owner' || group.myRole == 'admin';

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 160,
                pinned: true,
                actions: [
                  if (group.inviteCode != null)
                    IconButton(
                      icon: const Icon(Icons.share_outlined),
                      onPressed: () {
                        Clipboard.setData(
                          ClipboardData(text: group.inviteCode!),
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Kod nusxalandi')),
                        );
                      },
                    ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    group.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  background: group.coverUrl != null
                      ? Image.network(group.coverUrl!, fit: BoxFit.cover)
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
                            imageUrl: group.avatarUrl,
                            name: group.title,
                            size: AppAvatarSize.lg,
                          ),
                          const SizedBox(width: AppSpacing.space3),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    group.type == 'private'
                                        ? Icons.lock_outline
                                        : Icons.public,
                                    size: 14,
                                    color: AppColors.neutral400,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    group.type == 'private'
                                        ? 'Yopiq'
                                        : 'Ochiq',
                                    style: AppTextStyles.bodySm,
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  const Icon(Icons.people_outline,
                                      size: 14, color: AppColors.neutral400),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${group.membersCount} a\'zo',
                                    style: AppTextStyles.bodySm,
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      if (group.description != null &&
                          group.description!.isNotEmpty) ...[
                        const SizedBox(height: AppSpacing.space3),
                        Text(
                          group.description!,
                          style: AppTextStyles.bodyMd.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withValues(alpha: 0.8),
                          ),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.space4),
                      Row(
                        children: [
                          Expanded(
                            child: AppButton(
                              label: group.isJoined ? 'Chiqish' : 'Qo\'shilish',
                              variant: group.isJoined
                                  ? AppButtonVariant.outlined
                                  : AppButtonVariant.primary,
                              onPressed: () => ref
                                  .read(groupDetailProvider(groupId).notifier)
                                  .toggleJoin(),
                            ),
                          ),
                          if (group.isJoined) ...[
                            const SizedBox(width: AppSpacing.space3),
                            Expanded(
                              child: AppButton(
                                label: 'Chat',
                                variant: AppButtonVariant.outlined,
                                onPressed: () => context.push(
                                  AppRoutes.groupChatRoute(groupId),
                                  extra: group.title,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.space4,
                    AppSpacing.space2,
                    AppSpacing.space4,
                    AppSpacing.space2,
                  ),
                  child: Text(
                    'A\'zolar (${group.membersCount})',
                    style: AppTextStyles.labelLg.copyWith(
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) {
                    final m = data.members[i];
                    return MemberTile(
                      member: m,
                      canManage: canManage && m.id != currentUserId,
                      onRoleChange: (role) => ref
                          .read(groupDetailProvider(groupId).notifier)
                          .updateMemberRole(m.id, role),
                      onRemove: () => ref
                          .read(groupDetailProvider(groupId).notifier)
                          .removeMember(m.id),
                    );
                  },
                  childCount: data.members.length,
                ),
              ),
              if (data.hasMoreMembers)
                SliverToBoxAdapter(
                  child: Center(
                    child: TextButton(
                      onPressed: () => ref
                          .read(groupDetailProvider(groupId).notifier)
                          .loadMoreMembers(),
                      child: const Text('Ko\'proq ko\'rish'),
                    ),
                  ),
                ),
              const SliverToBoxAdapter(
                child: SizedBox(height: AppSpacing.space6),
              ),
            ],
          );
        },
        loading: () => const _DetailShimmer(),
        error: (e, _) => Scaffold(
          appBar: AppBar(),
          body: AppErrorState(
            message: e.toString().replaceFirst('Exception: ', ''),
            onRetry: () => ref.invalidate(groupDetailProvider(groupId)),
          ),
        ),
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
          colors: [Color(0xFF6C63FF), Color(0xFF4B44CC)],
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
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    ShimmerBox(width: 80, height: 12),
                    SizedBox(height: 6),
                    ShimmerBox(width: 60, height: 12),
                  ]),
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
