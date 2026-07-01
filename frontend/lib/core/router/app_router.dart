import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../features/auth/auth_notifier.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/auth/screens/goal_selection_screen.dart';
import '../../features/auth/screens/lock_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/otp_screen.dart';
import '../../features/auth/screens/profile_setup_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/reset_password_screen.dart';
import '../../features/auth/screens/welcome_screen.dart';
import '../../features/feed/screens/create_post_screen.dart';
import '../../features/feed/screens/feed_screen.dart';
import '../../features/feed/screens/post_detail_screen.dart';
import '../../features/goals/screens/create_goal_screen.dart';
import '../../features/goals/screens/goal_detail_screen.dart';
import '../../features/goals/screens/goals_screen.dart';
import '../../features/channels/screens/channel_detail_screen.dart';
import '../../features/channels/screens/channels_screen.dart';
import '../../features/channels/screens/create_channel_screen.dart';
import '../../features/groups/screens/create_group_screen.dart';
import '../../features/groups/screens/group_detail_screen.dart';
import '../../features/groups/screens/groups_screen.dart';
import '../../features/calls/screens/call_history_screen.dart';
import '../../features/calls/screens/call_screen.dart';
import '../../features/chat/screens/chat_screen.dart';
import '../../features/groups/screens/join_by_code_screen.dart';
import '../../features/notifications/screens/notifications_screen.dart';
import '../../features/profile/screens/edit_profile_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/profile/screens/public_profile_screen.dart';
import '../../features/settings/screens/appearance_screen.dart';
import '../../features/settings/screens/change_password_screen.dart';
import '../../features/settings/screens/language_screen.dart';
import '../../features/settings/screens/pin_setup_screen.dart';
import '../../features/settings/screens/two_fa_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../shared/widgets/adaptive_app_shell.dart';
import 'app_routes.dart';
import 'router_guard.dart';

part 'app_router.g.dart';

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref ref) {
  final notifier = ValueNotifier<int>(0);

  ref.listen(authProvider, (_, __) => notifier.value++);
  ref.onDispose(notifier.dispose);

  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: notifier,
    redirect: (context, state) => appRedirect(
      ref: ref,
      currentPath: state.uri.path,
    ),
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (_, __) => const _SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.welcome,
        builder: (_, __) => const WelcomeScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.register,
        builder: (_, __) => const RegisterScreen(),
      ),
      GoRoute(
        path: AppRoutes.otp,
        builder: (_, state) {
          final extra = state.extra as Map<String, String>? ?? {};
          return OtpScreen(
            userId: extra['userId'] ?? '',
            email: extra['email'] ?? '',
          );
        },
      ),
      GoRoute(
        path: AppRoutes.forgotPassword,
        builder: (_, __) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.resetPassword,
        builder: (_, state) => ResetPasswordScreen(
          email: state.uri.queryParameters['email'] ?? '',
        ),
      ),
      GoRoute(
        path: AppRoutes.profileSetup,
        builder: (_, __) => const ProfileSetupScreen(),
      ),
      GoRoute(
        path: AppRoutes.goalSelection,
        builder: (_, __) => const GoalSelectionScreen(),
      ),
      GoRoute(
        path: AppRoutes.lock,
        builder: (_, __) => const LockScreen(),
      ),
      GoRoute(
        path: '/posts/:postId',
        builder: (_, state) => PostDetailScreen(
          postId: state.pathParameters['postId']!,
        ),
      ),
      GoRoute(
        path: AppRoutes.createPost,
        builder: (_, state) {
          final extra = state.extra as Map<String, String>? ?? {};
          return CreatePostScreen(
            groupId: extra['groupId'],
            channelId: extra['channelId'],
          );
        },
      ),
      GoRoute(
        path: AppRoutes.createGoal,
        builder: (_, __) => const CreateGoalScreen(),
      ),
      GoRoute(
        path: AppRoutes.createGroup,
        builder: (_, __) => const CreateGroupScreen(),
      ),
      GoRoute(
        path: AppRoutes.joinGroupByCode,
        builder: (_, __) => const JoinByCodeScreen(),
      ),
      GoRoute(
        path: AppRoutes.createChannel,
        builder: (_, __) => const CreateChannelScreen(),
      ),
      GoRoute(
        path: '/call/:callId',
        builder: (_, s) => CallScreen(callId: s.pathParameters['callId']!),
      ),
      GoRoute(
        path: AppRoutes.callHistoryRoute,
        builder: (_, __) => const CallHistoryScreen(),
      ),
      GoRoute(
        path: AppRoutes.notifications,
        builder: (_, __) => const NotificationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.editProfile,
        builder: (_, __) => const EditProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.changePassword,
        builder: (_, __) => const ChangePasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.twoFaSettings,
        builder: (_, __) => const TwoFaScreen(),
      ),
      GoRoute(
        path: AppRoutes.pinSetup,
        builder: (_, __) => const PinSetupScreen(),
      ),
      GoRoute(
        path: AppRoutes.appearance,
        builder: (_, __) => const AppearanceScreen(),
      ),
      GoRoute(
        path: AppRoutes.language,
        builder: (_, __) => const LanguageScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => AdaptiveAppShell(
          child: child,
          selectedIndex: AdaptiveAppShell.indexFromPath(state.uri.path),
        ),
        routes: [
          GoRoute(
            path: AppRoutes.feed,
            builder: (_, __) => const FeedScreen(),
          ),
          GoRoute(
            path: AppRoutes.goals,
            builder: (_, __) => const GoalsScreen(),
            routes: [
              GoRoute(
                path: ':goalId',
                builder: (_, s) => GoalDetailScreen(
                  goalId: s.pathParameters['goalId']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.groups,
            builder: (_, __) => const GroupsScreen(),
            routes: [
              GoRoute(
                path: ':groupId',
                builder: (_, s) => GroupDetailScreen(
                  groupId: s.pathParameters['groupId']!,
                ),
                routes: [
                  GoRoute(
                    path: 'chat',
                    builder: (_, s) => ChatScreen(
                      chatType: 'group',
                      chatId: s.pathParameters['groupId']!,
                      chatName: s.extra as String? ?? 'Chat',
                    ),
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.channels,
            builder: (_, __) => const ChannelsScreen(),
            routes: [
              GoRoute(
                path: ':channelId',
                builder: (_, s) => ChannelDetailScreen(
                  channelId: s.pathParameters['channelId']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (_, __) => const ProfileScreen(),
            routes: [
              GoRoute(
                path: ':userId',
                builder: (_, s) => PublicProfileScreen(
                  userId: s.pathParameters['userId']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.settings,
            builder: (_, __) => const SettingsScreen(),
          ),
        ],
      ),
    ],
  );
}

class _SplashScreen extends StatelessWidget {
  const _SplashScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}
