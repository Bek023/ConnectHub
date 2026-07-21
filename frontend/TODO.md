# TODO — ConnectHub Frontend (Angular)

Backend'ning `TODO.md`sidagi bosqichlarni oynatib boradi (`../backend/TODO.md`). Har bir bosqich backend'dagi mos modul tayyor bo'lgach boshlanadi.

## Bosqich 1 — Scaffold + Auth + Shell ✅

- [x] `ng new` bilan Angular 22 standalone scaffold, Tailwind CSS v3 ulandi (Material'siz, SCSS'siz)
- [x] `core/` — `AuthService` (login/register/refresh/logout, `refreshAccessToken()` `shareReplay(1)` bilan concurrent 401'larni birlashtiradi), `TokenStorage` (access token xotirada, refresh token localStorage'da), funksional `authInterceptor` (Bearer header + 401 refresh-and-retry), funksional `authGuard`/`guestGuard`
- [x] `api-envelope.ts` — backend `{success,data}` konvertini avtomatik ochib beruvchi `apiGet/apiPost/apiPut/apiDelete` wrapper'lar
- [x] Auth sahifalari: Welcome, Login, Register, OTP tasdiqlash (email), 2FA tasdiqlash, Forgot/Reset password
- [x] `AppShell` — sidebar+topbar, barcha feature'lar uchun placeholder route'lar (`ComingSoon` komponenti)
- [x] To'liq real backend bilan sinaldi: register → MailDev orqali OTP → verify-email → login → shell render (`localhost:4000` backend, `localhost:1080` MailDev)
- [x] **Loyiha qoidalariga moslashtirildi** (qoidalar `CLAUDE.md`da): emoji ikonkalar HugeIcons'ga almashtirildi, uz/ru/en i18n ulandi (`public/i18n/`), ikkala tema (`ThemeService` + 75 ta `dark:` variant), route/list animatsiyalari, taste skill bo'yicha aksent indigo → emerald (AI-purple taqig'i), WCAG AA kontrast ikkala temada tasdiqlandi

## Bosqich 2 — Goals / Groups / Channels ✅

- [x] Modellar backend entity'lariga aynan mos (`Goal`, `Group`+`GroupMember`, `Channel`+`ChannelSubscriber`, `ChannelStats`)
- [x] `GoalsService`/`GroupsService`/`ChannelsService` + `Paginated<T>` umumiy tipi
- [x] Umumiy komponentlar: `SegmentedTabs`, `EmptyState`
- [x] Goals: ro'yxat (Ommabop/Barchasi/Meniki), detail (join/leave + bog'liq guruh va kanallar), yaratish (8 kategoriya, har biri o'z ikonkasi bilan)
- [x] Groups: ro'yxat (Mening/Kashf etish), detail (a'zolar ro'yxati, rol belgilari, admin uchun chiqarish, taklif kodi + nusxalash), yaratish, kod bilan qo'shilish
- [x] Channels: ro'yxat (Mening/Kashf etish), detail (subscribe/unsubscribe, egasi uchun statistika), yaratish
- [x] `ComingSoon` o'rniga 10 ta real route ulandi
- [x] Real sinov: maqsad → guruh → kanal zanjiri UI orqali yaratildi, join/subscribe ishladi, hisoblagichlar yangilandi, ierarxiya maqsad sahifasida ko'rindi

**Muhim eslatma (backend cheklovi):** hech bir ro'yxat endpointi joriy foydalanuvchi a'zoligini qaytarmaydi (`isJoined`/`isMember`/`isSubscribed` maydonlari yo'q). Shuning uchun frontend `/my` ro'yxatlaridan ID to'plami yasab holatni hisoblaydi — bu qo'shimcha so'rov talab qiladi. Backend bu maydonlarni qo'shsa, `loadJoined`/`loadMembership`/`loadSubscriptions` chaqiruvlarini olib tashlash mumkin.

**Qolgan:**
- [ ] Ro'yxatlarda pagination UI (hozircha `limit: 50` bilan bitta sahifa)
- [ ] Guruh/kanalni tahrirlash va o'chirish (servislarda `update`/`remove` bor, UI yo'q)
- [ ] A'zo rolini o'zgartirish UI (servisda `updateMemberRole` bor, UI faqat chiqarishni beradi)
- [ ] Guruh/kanal avatar va cover yuklash

## Bosqich 3 — Feed / Posts ✅

- [x] `Post`/`Comment` modellari, `PostsService`, `CursorPage<T>` tipi
- [x] `RelativeTimePipe` — `Intl.RelativeTimeFormat`, joriy tilga bog'langan
- [x] `PostCard` komponenti — avatar, muallif, vaqt, matn, media grid, like/izoh tugmalari, pin belgisi
- [x] Feed — page-based pagination ("Yana yuklash"), optimistik like (xatoda orqaga qaytaradi)
- [x] Post detail — izohlar cursor pagination bilan, izoh qo'shish/o'chirish, like, muallif uchun pin/unpin va o'chirish
- [x] Post yaratish — guruh/kanal tanlash (`chatType:chatId`), matn (4000 belgi), bir nechta rasm yuklash va olib tashlash
- [x] Real sinov: post yaratildi → 2 ta izoh → like → feed'da `isLiked` va hisoblagichlar to'g'ri ko'rindi

**Tuzatilgan bug:** `POST /posts/:id/comments` javobida eager `author` relation yo'q (TypeORM `save()` uni qaytarmaydi), shuning uchun yangi izoh muallifsiz ko'rinardi — `withAuthor()` joriy foydalanuvchidan to'ldiradi.

**Qolgan:**
- [ ] Postni tahrirlash UI (servisda `update` bor)
- [ ] Izohga javob berish (`replyTo` modelda va servisda bor, UI yo'q)
- [ ] Feed'da cheksiz scroll (hozircha "Yana yuklash" tugmasi)

## Bosqich 4 — Chat (WebSocket) ✅

- [x] `socket.io-client` o'rnatildi, `ChatSocketService` yozildi — `/chat` namespace, `handshake.auth.token` bilan autentifikatsiya
- [x] Eventlar: `joinChat`/`leaveChat`/`sendMessage`/`typing`/`reactToMessage`/`markRead` (chiquvchi), `newMessage`/`userTyping`/`messageReaction`/`messageRead` (kiruvchi)
- [x] **Reconnect'da yangi token** — `reconnect_attempt`da `handshake.auth.token` yangilanadi (access token 15 daqiqada tugaydi, aks holda reconnect rad etilardi)
- [x] **Reconnect'da roomlar tiklanadi** — `joinedChats` to'plami saqlanadi va `connect`da qayta yuboriladi
- [x] **Logout'da socket uziladi** — `AuthService.registerSessionTeardown()` orqali, aks holda keyingi login'da eski sessiya oqimlari aralashardi
- [x] `MessagesService` (REST) — tarix (cursor, ISO timestamp), tahrirlash, o'chirish, reaksiya, read-by
- [x] `ChatList` — foydalanuvchining guruhlari va kanallari (backend `ChatType` = group | channel)
- [x] `ChatRoom` — real-time xabarlar, tarix (cursor pagination, "Yana yuklash"), typing indikatori (3s timeout), rasm yuborish, xabarni o'chirish, ulanish holati indikatori
- [x] `MessageBubble` — o'z/o'zga xabar uslubi, media, reaksiyalar (guruhlangan hisoblagich bilan), tahrirlangan belgisi
- [x] Real sinov: WebSocket ulandi, xabarlar yuborildi va bazaga yozildi (`messages` jadvali), rasm+matn birga `messageType: image` bilan to'g'ri saqlandi

**Qolgan:**
- [ ] Optimistik yuborish (hozircha xabar server javobidan keyin ko'rinadi — eski Flutter TODO'da ham ochiq band edi)
- [ ] Xabarni tahrirlash UI (servisda `edit` bor)
- [ ] `markRead` UI'ga ulanmagan (servis va socket metodi tayyor)
- [ ] Javob berish (`replyTo` modelda bor, UI yo'q)

## Bosqich 5 — Calls (mediasoup WebRTC)

- [ ] `/calls` namespace signaling oqimi (joinCallRoom → createTransport → connectTransport → produce/consume)
- [ ] Call UI (audio/video controls, incoming call overlay)

## Bosqich 6 — Notifications / Search / Media

- [ ] `/notifications` namespace (real-time), bildirishnoma ro'yxati, o'qilgan deb belgilash
- [ ] Web Push (Notification API) — push token ro'yxatdan o'tkazish
- [ ] Global qidiruv (`/search`)
- [ ] Media yuklash (`/media/upload`) — rasm/video/ovoz/fayl, presigned URL

## Bosqich 7 — Profile / Settings ✅

- [x] `UsersService` (`GET/PUT/DELETE /users/me`, `GET /users/:id`) va `MediaService` (`POST /media/upload`)
- [x] `Avatar` umumiy komponenti — rasm yoki initsiallar (signal input'lar bilan)
- [x] `Profile` — o'z profili: avatar, ism, username, bio, email + tasdiqlangan belgisi, 2FA holati, ro'yxatdan o'tgan sana
- [x] `EditProfile` — ism, bio (300 belgi hisoblagichi bilan), avatar yuklash (tip/hajm validatsiyasi frontendda ham)
- [x] `Settings` — tema tanlash, til tanlash, parolni o'zgartirish, 2FA (QR + secret → enable/disable), chiqish, akkauntni o'chirish (tasdiq bilan)
- [x] Real sinovdan o'tdi: 2FA haqiqiy TOTP kod bilan yoqildi (bazada `two_fa_enabled=t`), avatar MinIO'ga yuklandi (`.webp` + thumbnail), bio saqlandi
- [x] Tuzatilgan buglar: sovuq yuklashda `currentUser` bo'sh qolgani uchun 2FA holati noto'g'ri ko'rinardi (`provideAppInitializer`da `fetchMe()` ulandi, `TwoFaSection.enabled` `computed`ga o'tkazildi); `Avatar` da `computed` oddiy `@Input`ni kuzatmasdi

**Qolgan:**
- [ ] Boshqa foydalanuvchi profili (`PublicProfile`) — `GET /users/:id`, feed/guruhlar ulangach kerak bo'ladi
- [ ] Parolni o'zgartirgach backend `refreshToken`ni o'chiradi, shuning uchun frontend majburan logout qiladi — kelajakda sessiyani saqlab qolish uchun backend yangi token juftini qaytarishi mumkin

## Bosqich 8 — CI/CD

- [ ] `.github/workflows/` — build+test pipeline (monorepo ildizida, `working-directory: frontend`)
