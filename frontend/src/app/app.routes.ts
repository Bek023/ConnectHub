import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'welcome',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'otp-verify',
    loadComponent: () => import('./features/auth/pages/otp-verify/otp-verify').then((m) => m.OtpVerify),
  },
  {
    path: 'two-fa',
    loadComponent: () => import('./features/auth/pages/two-fa/two-fa').then((m) => m.TwoFa),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadComponent: () => import('./features/posts/pages/feed/feed').then((m) => m.Feed),
      },
      {
        path: 'posts/create',
        loadComponent: () =>
          import('./features/posts/pages/create-post/create-post').then((m) => m.CreatePost),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import('./features/posts/pages/post-detail/post-detail').then((m) => m.PostDetail),
      },
      {
        path: 'goals',
        loadComponent: () =>
          import('./features/goals/pages/goals-list/goals-list').then((m) => m.GoalsList),
      },
      {
        path: 'goals/create',
        loadComponent: () =>
          import('./features/goals/pages/create-goal/create-goal').then((m) => m.CreateGoal),
      },
      {
        path: 'goals/:id',
        loadComponent: () =>
          import('./features/goals/pages/goal-detail/goal-detail').then((m) => m.GoalDetail),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/groups/pages/groups-list/groups-list').then((m) => m.GroupsList),
      },
      {
        path: 'groups/create',
        loadComponent: () =>
          import('./features/groups/pages/create-group/create-group').then((m) => m.CreateGroup),
      },
      {
        path: 'groups/join',
        loadComponent: () =>
          import('./features/groups/pages/join-by-code/join-by-code').then((m) => m.JoinByCode),
      },
      {
        path: 'groups/:id',
        loadComponent: () =>
          import('./features/groups/pages/group-detail/group-detail').then((m) => m.GroupDetail),
      },
      {
        path: 'channels',
        loadComponent: () =>
          import('./features/channels/pages/channels-list/channels-list').then(
            (m) => m.ChannelsList,
          ),
      },
      {
        path: 'channels/create',
        loadComponent: () =>
          import('./features/channels/pages/create-channel/create-channel').then(
            (m) => m.CreateChannel,
          ),
      },
      {
        path: 'channels/:id',
        loadComponent: () =>
          import('./features/channels/pages/channel-detail/channel-detail').then(
            (m) => m.ChannelDetail,
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/pages/chat-list/chat-list').then((m) => m.ChatList),
      },
      {
        path: 'chat/:chatType/:chatId',
        loadComponent: () =>
          import('./features/chat/pages/chat-room/chat-room').then((m) => m.ChatRoom),
      },
      {
        path: 'calls',
        loadComponent: () =>
          import('./features/calls/pages/calls-list/calls-list').then((m) => m.CallsList),
      },
      {
        path: 'calls/:id',
        loadComponent: () =>
          import('./features/calls/pages/call-room/call-room').then((m) => m.CallRoom),
      },
      { path: 'notifications', loadComponent: () => import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon) },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'profile/edit',
        loadComponent: () =>
          import('./features/profile/pages/edit-profile/edit-profile').then((m) => m.EditProfile),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  { path: '**', redirectTo: 'welcome' },
];
