# ConnectHub Flutter — TODO

---

## Bosqich 1: Shared Widgets ✓
- [x] `AppButton` — primary, outlined, text variantlari
- [x] `AppTextField` — label, error, password toggle
- [x] `AppAvatar` — rasm, initials, online indicator
- [x] `AppCard` — base card widget
- [x] `AppBadge` — notification count badge
- [x] `AppShimmer` — skeleton loader wrapper
- [x] `AppEmptyState` — bo'sh holat widget
- [x] `AppErrorState` — xato holat widget

---

## Bosqich 2: Auth Feature ✓
- [x] `AuthRepository` — register, login, OTP, refresh
- [x] `AuthNotifier` (AsyncNotifier + Riverpod)
- [x] Router guard — `authProvider` ga ulash
- [x] `WelcomeScreen`
- [x] `LoginScreen`
- [x] `RegisterScreen`
- [x] `OtpScreen` — email verification + 2FA
- [x] `ProfileSetupScreen` — ism, avatar, bio
- [x] `GoalSelectionScreen` — onboarding maqsad tanlash
- [x] `LockScreen` — PIN kirish
- [x] `ForgotPasswordScreen`
- [x] `ResetPasswordScreen`

---

## Bosqich 3: Feed Feature ✓
- [x] `PostModel` + `PostAuthorModel` (Freezed)
- [x] `FeedRepository` — getFeed, likePost, unlikePost, createPost
- [x] `FeedNotifier` — paginated + optimistic like toggle
- [x] `PostCard` widget
- [x] `PostHeader` — avatar, ism, vaqt
- [x] `PostMedia` — 1 yoki grid (4+)
- [x] `PostActionsBar` — like, comment, share
- [x] `FeedScreen` — pull-to-refresh + infinite scroll
- [x] Like / unlike — optimistic update + revert on error
- [x] Post share — share_plus

---

## Bosqich 4: Posts Feature ✓
- [x] `CommentModel` (Freezed) — id, author, content, replyTo, createdAt
- [x] `PostRepository` — getPost, getComments, addComment, deleteComment, pinPost, unpinPost, deletePost
- [x] `PostDetailNotifier` — post + comments, cursor pagination, optimistic delete
- [x] `CommentCard` widget — avatar, ism, vaqt, delete (own)
- [x] `CommentsSection` widget — list + shimmer + load more
- [x] `PostDetailScreen` — CustomScrollView + PostActionsBar + CommentsSection + comment input
- [x] `CreatePostScreen` — text + image_picker preview + FAB from FeedScreen
- [x] Add / delete comment — optimistic count update
- [x] Pin / unpin post — admin action (PopupMenu)
- [x] `FeedNotifier.createPost()` — prepends new post to feed

---

## Bosqich 5: Goals Feature ✓
- [x] `GoalModel` (Freezed) — title, description, category, membersCount, isJoined
- [x] `GoalsRepository` — getTrending, getMyGoals, getGoal, createGoal, joinGoal, leaveGoal, deleteGoal
- [x] `TrendingGoalsNotifier` + `MyGoalsNotifier` — paginated, updateJoinStatus sync
- [x] `GoalDetailNotifier` — family provider, optimistic toggleJoin
- [x] `GoalCard` widget — category icon+color, members count, join button
- [x] `GoalsScreen` — TabBar (Trend / Mening) + FAB → CreateGoalScreen
- [x] `GoalDetailScreen` — SliverAppBar cover, stats, join/leave button
- [x] `CreateGoalScreen` — title, description, category chip selector
- [x] Join / leave — optimistic + MyGoals list sync

---

## Bosqich 6: Groups Feature ✓
- [x] `GroupModel` + `GroupMemberModel` (Freezed)
- [x] `GroupsRepository` — getMyGroups, getGroup, getMembers, createGroup, joinGroup, joinByCode, leaveGroup, updateMemberRole, removeMember
- [x] `MyGroupsNotifier` + `GroupDetailNotifier` (GroupDetailState)
- [x] `GroupCard` widget — avatar, type icon, role badge
- [x] `MemberTile` widget — role badge, admin PopupMenu (change role / kick)
- [x] `GroupsScreen` — my groups list + FAB
- [x] `GroupDetailScreen` — SliverAppBar, members list, join/leave + Chat buttons
- [x] `CreateGroupScreen` — nom, tavsif, ochiq/yopiq tanlash
- [x] `JoinByCodeScreen` — taklif kodi bilan qo'shilish
- [x] Members role boshqaruvi — owner/admin tomonidan

---

## Bosqich 7: Channels Feature ✓
- [x] `ChannelModel` + `ChannelStatsModel` (Freezed)
- [x] `ChannelsRepository` — getMyChannels, discoverChannels, getChannel, getStats, createChannel, subscribe, unsubscribe, deleteChannel
- [x] `MyChannelsNotifier` + `DiscoverChannelsNotifier` — paginated, updateSubscription sync
- [x] `ChannelDetailNotifier` (ChannelDetailState) — lazy stats load, optimistic toggleSubscribe
- [x] `ChannelCard` widget — avatar, subscribers count, owner badge, category chip
- [x] `ChannelsScreen` — TabBar (Mening / Kashf et) + FAB
- [x] `ChannelDetailScreen` — SliverAppBar, stats section (owner only, _StatCard grid)
- [x] `CreateChannelScreen` — nom, tavsif, kategoriya chip selector
- [x] Subscribe / unsubscribe — optimistic + MyChannels list sync

---

## Bosqich 8: Chat Feature ✓
- [x] `MessageModel` (Freezed)
- [x] `ChatRepository` — REST (tarix yuklash)
- [x] `ChatSocketService` — `/chat` namespace
- [x] `ChatProvider` — real-time xabarlar
- [x] Sembast lokal kesh (`SembastDbService` implement)
- [x] `ChatScreen`
- [x] `MessageBubble` widget
- [x] Typing indicator
- [x] Emoji reaction
- [x] Message read receipts
- [x] Media xabar (rasm — ko'rsatish)
- [ ] Desktop: `ChatPreviewPanel` (side panel)

---

## Bosqich 9: Calls Feature ✓
- [x] `CallModel` + `CallParticipantModel` (Freezed)
- [x] `CallsRepository` — initiate, join, leave, end, participants, history
- [x] `CallSocketService` — `/calls` namespace, broadcast streams
- [x] `CallWebRtcService` — getUserMedia, renderers, mute/video/flip
- [x] `ActiveCallNotifier` (keepAlive) + `CallHistoryNotifier`
- [x] `CallScreen` — audio/video UI, controls, local PiP preview
- [x] `CallHistoryScreen` — qo'ng'iroqlar tarixi
- [x] `IncomingCallOverlay` — qabul qilish / rad etish
- [x] Routes: `/call/:callId`, `/call-history`

---

## Bosqich 10: Notifications Feature ✓
- [x] `NotificationModel` (Freezed)
- [x] `NotificationsRepository` — list, markRead, markAllRead, delete, pushRegister
- [x] `NotificationsNotifier` (keepAlive) + `unreadNotificationsCountProvider`
- [x] `NotificationsScreen` — pull-to-refresh, swipe delete, mark all read
- [x] `NotificationTile` — type icon, badge, dismiss, relative time
- [x] Real-time: `/notifications` socket namespace (`NotificationSocketService`)
- [x] Mobile: FCM + `flutter_local_notifications` (`PushNotificationService`)
- [x] Web: Browser Notification API (`WebNotifications`)
- [x] Push token register (`/notifications/push/register`)
- [x] Bell icon + unread badge — FeedScreen AppBar
- [x] Route: `/notifications`

---

## Bosqich 11: Profile Feature
- [ ] `UserModel` (Freezed)
- [ ] `ProfileRepository`
- [ ] `ProfileScreen` — o'z profili
- [ ] `PublicProfileScreen` — boshqa foydalanuvchi
- [ ] `EditProfileScreen`
- [ ] Avatar upload (media_upload endpoint)
- [ ] SEO meta — `SeoService.setProfileMeta`

---

## Bosqich 12: Settings Feature
- [ ] `SettingsScreen`
- [ ] Tema o'zgartirish (ThemeModeNotifier)
- [ ] Til o'zgartirish (LocaleNotifier)
- [ ] PIN o'rnatish / o'chirish
- [ ] Biometrik yoqish / o'chirish (mobile only)
- [ ] 2FA setup / enable / disable
- [ ] Change password
- [ ] Logout

---

## Bosqich 13: L10n
- [ ] `lib/l10n/app_uz.arb` — barcha kalitlar
- [ ] `lib/l10n/app_ru.arb`
- [ ] `lib/l10n/app_en.arb`
- [ ] `MaterialApp.router` ga `localizationsDelegates` + `locale` ulash

---

## Bosqich 14: Platform-specific
- [ ] `platforms/mobile/push_notification.dart` — FCM init
- [ ] `platforms/mobile/biometric_handler.dart` — local_auth wrapper
- [ ] `platforms/desktop/desktop_notifications.dart`
- [ ] macOS `Release.entitlements` — camera, microphone, network
- [ ] Android `AndroidManifest.xml` — ruxsatlar
- [ ] iOS `Info.plist` — ruxsatlar
- [ ] PWA manifest + service worker

---

## Bosqich 15: API Layer (Retrofit)
- [ ] `retrofit_generator` qayta qo'shish (freezed v3 yoki mos versiya)
- [ ] `AuthApiService` (@RestApi)
- [ ] `PostsApiService`
- [ ] `GoalsApiService`
- [ ] `GroupsApiService`
- [ ] `ChannelsApiService`
- [ ] `MessagesApiService`
- [ ] `CallsApiService`
- [ ] `NotificationsApiService`
- [ ] `UsersApiService`
- [ ] `MediaApiService`

---

## Bosqich 16: CI/CD
- [ ] `.github/workflows/test.yml`
- [ ] `.github/workflows/build_web.yml` + deploy
- [ ] `.github/workflows/build_android.yml`
- [ ] `.github/workflows/build_ios.yml`
- [ ] `.github/workflows/build_macos.yml`
- [ ] Sentry DSN sozlash
