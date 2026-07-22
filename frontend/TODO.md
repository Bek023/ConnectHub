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
- [x] **Ro'yxatlarda pagination UI** — umumiy `LoadMore` komponenti (`shared/components/load-more/`), sahifa hajmi 20. Goals (`all` tabi), Groups va Channels (ikkala tabi) ulandi; goals'ning `trending`/`my` tablari backendda paginatsiyalanmagan (bare array qaytaradi), shuning uchun ularda tugma ko'rinmaydi. Tab almashganda sahifa 1 ga qaytadi, xato bo'lsa sahifa raqami orqaga tiklanadi. `common.loadMore` kaliti qo'shildi va chat/feed/post-detail ham semantik noto'g'ri `posts.loadMore` dan shunga o'tkazildi

**Diqqat:** `my` tabi paginatsiyalangach a'zolik to'plami (`memberIds`/`subscribedIds`) faqat birinchi sahifadan yig'ilib qolardi va "Discover" tabidagi a'zolik belgisi noto'g'ri ko'rinardi. Endi `rememberOwn()` har sahifani to'plamga **qo'shadi**, almashtirmaydi; boshlang'ich to'plam esa avvalgidek alohida `loadMembership()` (`limit: 100`) chaqiruvidan keladi.
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
- [x] **Optimistik yuborish** — xabar darhol `sending` holatida ko'rinadi, server javobidan keyin almashtiriladi; 10s ichida javob kelmasa yoki `exception` kelsa `failed` bo'lib qayta urinish tugmasi chiqadi. Yuboruvchi `newMessage` va `messageSent` ni **ikkalasini** oladi (o'lchangan tartib: `newMessage` → `messageSent`), shuning uchun ikkalasi bitta `reconcile()` orqali o'tadi — aks holda har bir o'z xabaring ikki marta ko'rinardi. Moslashtirish `content`+`mediaUrl` bo'yicha, chunki `SendMessageDto` da `forbidNonWhitelisted: true` — payloadga correlation id qo'shib bo'lmaydi
- [ ] Xabarni tahrirlash UI (servisda `edit` bor)
- [ ] `markRead` UI'ga ulanmagan (servis va socket metodi tayyor)
- [ ] Javob berish (`replyTo` modelda bor, UI yo'q)

## Bosqich 5 — Calls (mediasoup WebRTC) ✅

- [x] `mediasoup-client` o'rnatildi, `CallSocketService` yozildi — `/calls` namespace, to'liq signaling oqimi: `joinCallRoom` → `Device.load` → `createTransport` (send+recv) → `connectTransport` → `produce` → `consume` → `resumeConsumer`
- [x] **Aralash javob shakli hal qilindi** — Nest gateway'da bir qism handlerlar `{event, data}` (WsResponse) qaytaradi va alohida event sifatida keladi (`joinedCallRoom`, `transportConnected`, `consumerResumed`), qolganlari esa oddiy qiymat qaytarib socket.io ack orqali keladi (`createTransport`, `produce`, `consume`, `getProducers`). `request()` helperi ikkalasini ham kutadi va qaysi biri birinchi kelsa o'shani oladi, 10s timeout bilan
- [x] Reconnect'da handshake tokeni yangilanadi, logout'da socket uziladi (chat socketidagi kabi)
- [x] `NotificationSocketService` — `/notifications` namespace, `incomingCall` va `callEnded` eventlari (6-bosqichda kengaytiriladi)
- [x] `IncomingCallOverlay` — app shell'ga global ulangan, qabul qilish/rad etish
- [x] `CallRoom` — video/audio tile'lar grid'i, mikrofon va kamera toggle (producer pause/resume), davomiylik taymeri, ulanish holati, chiqish va "hamma uchun tugatish"
- [x] `VideoTile` — `srcObject` `effect()` orqali bog'lanadi, video yo'q bo'lsa avatar, mikrofon o'chiq belgisi
- [x] `CallsList` — qo'ng'iroqlar tarixi, davom etayotganiga qayta qo'shilish
- [x] Chat xonasiga audio/video qo'ng'iroq tugmalari + "bu chatda qo'ng'iroq davom etmoqda" banneri
- [x] uz/ru/en tarjimalari (25 kalit), ikkala tema, `animate-fade-up`, `control-btn` klasslari `styles.css` da

**Backendga qo'shildi (bu bosqich uchun zarur edi):** `calls` moduli qo'ng'iroq boshlanganini hech kimga xabar qilmasdi — chaqirilgan odam `callId`ni bilishning imkoni yo'q edi. Qo'shildi:
- `CallsService.create()` endi chat a'zolariga `NotificationType.CALL` yozuvi + `incomingCall` socket eventi yuboradi
- `GET /calls/active?chatId=` — chatdagi faol qo'ng'iroq
- `initiate` endi a'zolikni tekshiradi (avval istalgan odam istalgan chatda qo'ng'iroq boshlay olardi) va idempotent — mavjud `ongoing` qo'ng'iroq bo'lsa yangisini yaratmaydi
- `end()` chat a'zolariga `callEnded` yuboradi
- `ChatMembershipService.memberIdsFor()` va `assertMemberAnyType()`

**Sinovdan o'tkazildi:** 8/8 integratsiya testi (3 ta foydalanuvchi, guruh, real socket) — incomingCall real-time keldi, DB bildirishnomasi yozildi, `/calls/active` to'g'ri ishladi, takroriy initiate yangi qo'ng'iroq yaratmadi, begona foydalanuvchi 403 oldi, `callEnded` keldi va tugagach `active` bo'shadi.

**Qolgan:**
- [ ] **Media oqimi ikkita real brauzerda sinalmagan** — signaling kodi to'liq, lekin `getUserMedia` + mediasoup transportlari haqiqiy kamera/mikrofon bilan tekshirilmadi (bu muhitda ikkita kameralı brauzerni boshqarib bo'lmadi). Birinchi ish: ikkita brauzer oynasida qo'ng'iroq qilib ko'rish
- [ ] Ekran ulashish (`getDisplayMedia` + ikkinchi video producer)
- [ ] Qo'ng'iroqni rad etish hozir faqat lokal — overlay yopiladi, chaqiruvchiga xabar bormaydi (backendda `declineCall` eventi yo'q)
- [ ] Ovoz darajasi indikatori (`speaking` input `VideoTile` da bor, lekin hech kim to'ldirmaydi — audio level detection kerak)
- [ ] Qo'ng'iroq davom etayotganda boshqa sahifaga o'tsa uziladi — global "mini call bar" kerak

## Bosqich 6 — Notifications / Search / Media

- [x] **Bildirishnomalar** — `/notifications` sahifasi (ro'yxat, pagination, o'qilgan deb belgilash, bitta yoki hammasini, o'chirish, bosilganda tegishli post/chat/qo'ng'iroqqa o'tish), sidebar'da o'qilmagan badge, real-time `notification` eventi
- [x] **Backend emissiyasi qo'shildi** — `NotificationType` da 6 ta tur bor edi, lekin faqat `calls` bildirishnoma yaratardi, ya'ni sahifa deyarli bo'sh bo'lardi. Endi like, izoh va xabar reaksiyasi ham yaratadi (`NotificationsService.push()` create + socket emit ni birlashtiradi va o'z-o'ziga yuborishni bloklaydi). Yangi `GET /notifications/unread-count`
- [x] **Web Push — to'liq ulandi.** Backendda `web-push` paketi, VAPID kalitlari (`.env`), `WebPushService` — `NotificationsService.push()` har bildirishnomada obunachilarga yuboradi, `404`/`410` javobida obunani avtomatik o'chiradi. `GET /notifications/push/public-key` (public) va `DELETE /notifications/push/unregister` qo'shildi. `push_tokens.token` `varchar(500)` dan `text` ga kengaytirildi (migratsiya `1784726000000-WidenPushToken`) — obuna JSON'i 500 belgidan oshishi mumkin
- [x] Frontendda `public/sw.js` (push -> `showNotification`, `notificationclick` -> tegishli sahifaga o'tish), `PushService` (ruxsat so'rash, `PushManager.subscribe()`, obunani serverga yuborish/o'chirish) va Sozlamalardagi `PushSection` toggle'i

**Sinov:** 8/8 — soxta HTTPS push xizmatiga haqiqiy so'rov keldi: to'g'ri endpoint, `vapid t=...` Authorization sarlavhasi, `aes128gcm` bilan shifrlangan 384 baytlik payload; `410 Gone` qaytarilganda obuna bazadan o'chdi.

**Sinalmagan qism:** brauzerdagi ruxsat oynasi va haqiqiy FCM/Mozilla push xizmati orqali yetkazish — buni faqat siz brauzerda "Yoqish" tugmasini bosib tekshira olasiz. Yuborish yo'li (backend -> push xizmati) real shifrlangan so'rov bilan tasdiqlangan, obuna yo'li (brauzer -> backend) kod jihatdan tayyor lekin bosib ko'rilmagan.
- [x] **Global qidiruv** — `/search` sahifasi, 350ms debounce, kamida 2 belgi, natijalar maqsad/guruh/xabar bo'limlariga ajratilgan va tegishli sahifaga havola qiladi. `ELASTICSEARCH_URL` bo'sh, ya'ni backend Postgres FTS fallback'ida ishlaydi (`to_tsvector` + `ILIKE`) — sinab ko'rildi, to'liq va qisman moslik ikkalasi ham topadi
- [x] Backendda `chat_type` xabar qidiruvi natijasiga qo'shildi — usiz `/chat/:chatType/:chatId` havolasini qurib bo'lmasdi

**Qidiruv cheklovlari:** kanallar umuman qidirilmaydi (`PG_FTS_TABLES` da `channels` yo'q), postlar ham; natijalar xom DB qatorlari — camelCase emas, snake_case (`goal_id`, `member_count`, `chat_id`); paginatsiya yo'q, qattiq `size = 20`.
- [x] **Media yuklash — barcha turlar** — chat kompozitori endi rasm, video, ovoz va fayl qabul qiladi (`MEDIA_RULES` frontendda backend `ALLOWED_MIME_TYPES`/`MAX_SIZES` ga mos), tur mime bo'yicha aniqlanadi va `messageType` ga aylanadi. `MessageBubble` har turni o'z ko'rinishida chizadi: `<video controls>`, `<audio controls>`, fayl uchun yuklab olish havolasi
- [x] Backendda buzuq rasm endi **400** qaytaradi, avval `sharp` xatosi 500 ga aylanib "Ichki server xatosi" berardi
- [x] Frontend validatsiya xabari tuzatildi — avval `errorMessage.set('')` qilinardi, ya'ni noto'g'ri fayl **jimgina** rad etilardi

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
