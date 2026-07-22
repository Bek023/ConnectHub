import { environment } from '../../../../environments/environment';

export const API_BASE_URL = environment.apiUrl;

export const ApiEndpoints = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
    login: `${API_BASE_URL}/auth/login`,
    verify2FaLogin: `${API_BASE_URL}/auth/2fa/verify-login`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    twoFaSetup: `${API_BASE_URL}/auth/2fa/setup`,
    twoFaEnable: `${API_BASE_URL}/auth/2fa/enable`,
    twoFaDisable: `${API_BASE_URL}/auth/2fa/disable`,
  },
  users: {
    me: `${API_BASE_URL}/users/me`,
    search: `${API_BASE_URL}/users/search`,
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  goals: {
    root: `${API_BASE_URL}/goals`,
    trending: `${API_BASE_URL}/goals/trending`,
    my: `${API_BASE_URL}/goals/my`,
    byId: (id: string) => `${API_BASE_URL}/goals/${id}`,
    join: (id: string) => `${API_BASE_URL}/goals/${id}/join`,
    leave: (id: string) => `${API_BASE_URL}/goals/${id}/leave`,
  },
  groups: {
    root: `${API_BASE_URL}/groups`,
    my: `${API_BASE_URL}/groups/my`,
    byId: (id: string) => `${API_BASE_URL}/groups/${id}`,
    join: (id: string) => `${API_BASE_URL}/groups/${id}/join`,
    joinByCode: (code: string) => `${API_BASE_URL}/groups/join/${code}`,
    leave: (id: string) => `${API_BASE_URL}/groups/${id}/leave`,
    members: (id: string) => `${API_BASE_URL}/groups/${id}/members`,
    member: (id: string, userId: string) => `${API_BASE_URL}/groups/${id}/members/${userId}`,
  },
  channels: {
    root: `${API_BASE_URL}/channels`,
    my: `${API_BASE_URL}/channels/my`,
    byId: (id: string) => `${API_BASE_URL}/channels/${id}`,
    subscribe: (id: string) => `${API_BASE_URL}/channels/${id}/subscribe`,
    unsubscribe: (id: string) => `${API_BASE_URL}/channels/${id}/unsubscribe`,
    subscribers: (id: string) => `${API_BASE_URL}/channels/${id}/subscribers`,
    stats: (id: string) => `${API_BASE_URL}/channels/${id}/stats`,
  },
  messages: {
    byChat: (chatType: string, chatId: string) =>
      `${API_BASE_URL}/messages/${chatType}/${chatId}`,
    byId: (id: string) => `${API_BASE_URL}/messages/${id}`,
    react: (id: string) => `${API_BASE_URL}/messages/${id}/react`,
    readBy: (id: string) => `${API_BASE_URL}/messages/${id}/read-by`,
  },
  posts: {
    root: `${API_BASE_URL}/posts`,
    feed: `${API_BASE_URL}/posts/feed`,
    byId: (id: string) => `${API_BASE_URL}/posts/${id}`,
    like: (id: string) => `${API_BASE_URL}/posts/${id}/like`,
    liked: (id: string) => `${API_BASE_URL}/posts/${id}/liked`,
    pin: (id: string) => `${API_BASE_URL}/posts/${id}/pin`,
    comments: (id: string) => `${API_BASE_URL}/posts/${id}/comments`,
    comment: (id: string, commentId: string) =>
      `${API_BASE_URL}/posts/${id}/comments/${commentId}`,
  },
  notifications: {
    root: `${API_BASE_URL}/notifications`,
    unreadCount: `${API_BASE_URL}/notifications/unread-count`,
    readAll: `${API_BASE_URL}/notifications/read-all`,
    read: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
    byId: (id: string) => `${API_BASE_URL}/notifications/${id}`,
    pushRegister: `${API_BASE_URL}/notifications/push/register`,
  },
  calls: {
    initiate: `${API_BASE_URL}/calls/initiate`,
    active: `${API_BASE_URL}/calls/active`,
    history: `${API_BASE_URL}/calls/history`,
    join: (id: string) => `${API_BASE_URL}/calls/${id}/join`,
    leave: (id: string) => `${API_BASE_URL}/calls/${id}/leave`,
    end: (id: string) => `${API_BASE_URL}/calls/${id}/end`,
    participants: (id: string) => `${API_BASE_URL}/calls/${id}/participants`,
  },
  media: {
    upload: `${API_BASE_URL}/media/upload`,
    byKey: (key: string) => `${API_BASE_URL}/media/${key}`,
    presigned: (key: string) => `${API_BASE_URL}/media/presigned/${key}`,
  },
} as const;

export const AUTH_SKIP_URLS = [
  ApiEndpoints.auth.login,
  ApiEndpoints.auth.register,
  ApiEndpoints.auth.refresh,
  ApiEndpoints.auth.verifyEmail,
  ApiEndpoints.auth.resendVerification,
  ApiEndpoints.auth.forgotPassword,
  ApiEndpoints.auth.resetPassword,
];
