/// Backend API endpointlari.
/// Manba: API_DOCS.md. Base URL `.env` / `--dart-define=API_URL` orqali keladi
/// (qarang: [ApiEndpoints.baseUrl]).
abstract class ApiEndpoints {
  /// Dev uchun standart. Prod build'da --dart-define=API_URL bilan almashtiriladi.
  static const baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:4000/api/v1',
  );

  static const wsUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'http://localhost:4000',
  );

  // ---- Auth ----
  static const register = '/auth/register';
  static const verifyEmail = '/auth/verify-email';
  static const resendVerification = '/auth/resend-verification';
  static const login = '/auth/login';
  static const twoFaVerifyLogin = '/auth/2fa/verify-login';
  static const refresh = '/auth/refresh';
  static const logout = '/auth/logout';
  static const me = '/auth/me';
  static const changePassword = '/auth/change-password';
  static const forgotPassword = '/auth/forgot-password';
  static const resetPassword = '/auth/reset-password';
  static const twoFaSetup = '/auth/2fa/setup';
  static const twoFaEnable = '/auth/2fa/enable';
  static const twoFaDisable = '/auth/2fa/disable';

  // ---- Users ----
  static const usersMe = '/users/me';
  static const usersSearch = '/users/search';
  static String userById(String id) => '/users/$id';

  // ---- Posts ----
  static const postsFeed = '/posts/feed';
  static const posts = '/posts';
  static String postById(String id) => '/posts/$id';
  static String postLike(String id) => '/posts/$id/like';
  static String postLiked(String id) => '/posts/$id/liked';
  static String postComments(String id) => '/posts/$id/comments';
  static String postComment(String id, String commentId) =>
      '/posts/$id/comments/$commentId';
  static String postPin(String id) => '/posts/$id/pin';

  // ---- Messages (REST) ----
  static String messages(String chatType, String chatId) =>
      '/messages/$chatType/$chatId';
  static String messageById(String id) => '/messages/$id';
  static String messageReact(String id) => '/messages/$id/react';
  static String messageReadBy(String id) => '/messages/$id/read-by';

  // ---- Groups ----
  static const groups = '/groups';
  static const groupsMy = '/groups/my';
  static String groupById(String id) => '/groups/$id';
  static String groupJoin(String id) => '/groups/$id/join';
  static String groupJoinByCode(String code) => '/groups/join/$code';
  static String groupLeave(String id) => '/groups/$id/leave';
  static String groupMembers(String id) => '/groups/$id/members';
  static String groupMember(String id, String userId) =>
      '/groups/$id/members/$userId';

  // ---- Channels ----
  static const channels = '/channels';
  static const channelsMy = '/channels/my';
  static String channelById(String id) => '/channels/$id';
  static String channelSubscribe(String id) => '/channels/$id/subscribe';
  static String channelUnsubscribe(String id) => '/channels/$id/unsubscribe';
  static String channelSubscribers(String id) => '/channels/$id/subscribers';
  static String channelStats(String id) => '/channels/$id/stats';

  // ---- Goals ----
  static const goals = '/goals';
  static const goalsTrending = '/goals/trending';
  static const goalsMy = '/goals/my';
  static String goalById(String id) => '/goals/$id';
  static String goalJoin(String id) => '/goals/$id/join';
  static String goalLeave(String id) => '/goals/$id/leave';

  // ---- Calls (REST) ----
  static const callInitiate = '/calls/initiate';
  static String callJoin(String id) => '/calls/$id/join';
  static String callLeave(String id) => '/calls/$id/leave';
  static String callEnd(String id) => '/calls/$id/end';
  static String callParticipants(String id) => '/calls/$id/participants';
  static const callHistory = '/calls/history';

  // ---- Notifications ----
  static const notifications = '/notifications';
  static const notificationsReadAll = '/notifications/read-all';
  static String notificationRead(String id) => '/notifications/$id/read';
  static String notificationById(String id) => '/notifications/$id';
  static const notificationsPushRegister = '/notifications/push/register';

  // ---- Search ----
  static const search = '/search';
  static const searchSuggestions = '/search/suggestions';

  // ---- Media ----
  static const mediaUpload = '/media/upload';
  static String mediaByKey(String key) => '/media/$key';
  static String mediaPresigned(String key) => '/media/presigned/$key';

  // ---- Health ----
  static const health = '/health';

  // ---- WebSocket namespaces ----
  static const wsChatNamespace = '/chat';
  static const wsCallsNamespace = '/calls';
  static const wsNotificationsNamespace = '/notifications';
}
