abstract class AppRoutes {
  static const splash = '/splash';
  static const welcome = '/welcome';
  static const login = '/login';
  static const register = '/register';
  static const otp = '/otp';
  static const profileSetup = '/profile-setup';
  static const goalSelection = '/goal-selection';
  static const lock = '/lock';

  static const feed = '/feed';
  static const goals = '/goals';
  static const groups = '/groups';
  static const channels = '/channels';
  static const profile = '/profile';
  static const settings = '/settings';
  static const forgotPassword = '/forgot-password';
  static const resetPassword = '/reset-password';

  static String goalDetail(String goalId) => '$goals/$goalId';
  static String goalDetailRoute(String goalId) => '$goals/$goalId';
  static String groupDetailRoute(String groupId) => '$groups/$groupId';
  static String groupChatRoute(String groupId) => '$groups/$groupId/chat';
  static String channelDetailRoute(String channelId) => '$channels/$channelId';
  static String groupDetail(String groupId) => '$groups/$groupId';
  static String groupChat(String groupId) => '$groups/$groupId/chat';
  static String channelDetail(String channelId) => '$channels/$channelId';
  static String publicProfile(String username) => '$profile/$username';

  static const postDetail = '/posts/:postId';
  static const createPost = '/new-post';
  static const createGoal = '/new-goal';
  static const createGroup = '/new-group';
  static const joinGroupByCode = '/join-group';
  static const createChannel = '/new-channel';

  static String postDetailRoute(String postId) => '/posts/$postId';
  static String resetPasswordRoute(String email) =>
      '$resetPassword?email=${Uri.encodeComponent(email)}';

  static const callScreen = '/call/:callId';
  static String callScreenRoute(String callId) => '/call/$callId';
  static const callHistoryRoute = '/call-history';

  static const notifications = '/notifications';
  static const editProfile = '/edit-profile';
  static String publicProfileRoute(String userId) => '$profile/$userId';

  static const changePassword = '/change-password';
  static const twoFaSettings = '/two-fa';
  static const pinSetup = '/pin-setup';
  static const appearance = '/appearance';
  static const language = '/language';
}
