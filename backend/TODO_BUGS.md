# Backend — Bug va kamchiliklar tahlili (2026-07-02)

Kod tahlili natijasida topilgan muammolar. Ustuvorlik bo'yicha guruhlangan.

**Holat (2026-07-02):** Redis adapter'dan tashqari barcha topilgan muammolar tuzatildi. `tsc --noEmit` toza, 174/174 unit test o'tadi. Video /tmp tozalash allaqachon `video.processor.ts`da `finally` bloki bilan hal qilingan ekan.

## Live test topilmalari (2026-07-02, real Postgres/Redis/MailDev bilan) — hammasi tuzatildi

- [x] **Barcha ro'yxat endpointlari param'siz chaqirilganda 500 berardi** (`/posts/feed`, `/notifications`, `/groups`, va h.k.) — global `ValidationPipe`ning `enableImplicitConversion: true`si berilmagan `@Query('page') page?: number` paramni `Number(undefined) = NaN`ga aylantiradi, service'dagi `page = 1` defaulti ishlamaydi (`NaN !== undefined`) va TypeORM `skip: NaN`da yiqiladi. `ParseIntPipe({ optional: true })` ham yetmaydi — global pipe param-level pipe'dan OLDIN ishlab, unga tayyor `NaN` uzatadi. Yechim: `src/common/pipes/optional-int.pipe.ts` (`OptionalIntPipe`) — `undefined`/`null`/`''`/`NaN`ni `undefined` qaytaradi, 9 ta controller'dagi barcha raqamli query paramlarga qo'llandi
- [x] **`GET /groups/my` va `GET /channels/my` backend'da umuman yo'q edi** — frontend (`groups_repository.dart`, `channels_repository.dart`) ularni chaqiradi, lekin so'rov `GET /groups/:id`ga tushib `invalid input syntax for type uuid: "my"` bilan 500 berardi. `GroupsService.findMy`/`ChannelsService.findMy` (a'zolik/obuna bo'yicha `innerJoin`) va route'lar (`:id`dan OLDIN deklaratsiya qilingan) qo'shildi
- [x] **`GET /calls/history` 500 berardi** — `orderBy('call.started_at')` `skip`/`take` bilan birga ishlatilganda TypeORM entity property yo'lini talab qiladi (`call.startedAt`), column nomi emas — aks holda `Cannot read properties of undefined (reading 'databaseName')`
- [x] Master'da yotgan 10 ta lint xatosi tuzatildi: `auth.service.spec.ts`dagi 6 ta inline `require('speakeasy')` top-level importga almashtirildi, `verify-2fa-login.dto.ts`dagi ishlatilmagan `IsUUID` olib tashlandi, `serializeUser`dagi destructure-omit uchun `.eslintrc.js`ga `ignoreRestSiblings: true` qo'shildi

Frontend kontraktiga ta'sir qiluvchi backend o'zgarishlari (frontendni moslashda kerak bo'ladi):
- `GET /messages/:chatType/:chatId` endi `{ items, nextCursor }` qaytaradi (avval oddiy massiv edi); cursor — ISO timestamp
- `POST /auth/2fa/verify-login` endi `user` obyektini ham qaytaradi
- `messageReaction` WS eventi endi to'liq `reactions` ro'yxatini o'z ichiga oladi
- `GET /posts/feed` har bir postda `isLiked` maydonini qaytaradi (author allaqachon eager yuklanardi)
- `markRead` WS eventi endi chat roomga `messageRead` sifatida broadcast qilinadi
- Media key formati endi `<type>s/<userId>/<uuid>.<ext>`; rasmlar `.webp`ga konvert qilinadi; `file` turi endi public emas (presigned URL kerak)
- Google OAuth callback endi `FRONTEND_URL/auth/callback#accessToken=...&refreshToken=...&userId=...` ga redirect qiladi
- `joinChat` WS eventi endi a'zolikni tekshiradi; `GET /search` endi auth talab qiladi

## Kritik — avtorizatsiya teshiklari

- [x] **Guruhni istalgan user tahrirlashi/o'chirishi mumkin** — `groups.controller.ts` `PUT /groups/:id` va `DELETE /groups/:id` faqat JwtAuthGuard bilan himoyalangan, admin/owner tekshiruvi umuman yo'q (`groups.service.ts` `update`/`remove` ham tekshirmaydi)
- [x] **Istalgan user istalgan a'zoni guruhdan chiqara oladi** — `DELETE /groups/:id/members/:uid` (`removeMember`) actor rolini tekshirmaydi; `updateMemberRole`dagi kabi admin tekshiruvi kerak
- [x] **Istalgan user istalgan postni tahrirlash/o'chirish/pin qilishi mumkin** — `posts.controller.ts` `update`, `remove`, `pin`, `unpin` ownership/admin tekshiruvisiz; `removeComment` ham — istalgan izohni o'chiradi va comment topilmasa ham `commentCount`ni kamaytiradi
- [x] **Kanalni istalgan user tahrirlashi/o'chirishi mumkin** — `channels.controller.ts` `PUT/DELETE /channels/:id` — `createdById` tekshiruvi yo'q
- [x] **Istalgan auth user istalgan chatning xabarlarini o'qiy oladi** — `GET /messages/:chatType/:chatId` (`findByChat`) va `readBy` chat a'zoligini tekshirmaydi
- [x] **WS orqali ham xuddi shu teshik** — `chat.gateway.ts` `joinChat` membership tekshiruvisiz istalgan `chat:*` roomga qo'shib qo'yadi — begona odam live xabarlarni oladi va `sendMessage` bilan istalgan chatga yoza oladi
- [x] **`GET /search` @Public bo'lib xabarlarni qidiradi** — `search.controller.ts` autentifikatsiyasiz foydalanuvchiga `messages` indexi bo'yicha qidiruv beradi; PG fallback (`searchPostgres`) esa `SELECT ... , *` bilan jadvalning barcha ustunlarini qaytaradi
- [x] **Istalgan user bucketdagi istalgan faylni o'chira oladi** — `media.controller.ts` `DELETE /media/:key` — fayl kimga tegishliligi saqlanmaydi va tekshirilmaydi
- [x] **Boshqa userning bildirishnomasini o'qish/o'chirish mumkin** — `notifications.service.ts` `markRead(id)` va `remove(id)` `userId` filtrisiz update/delete qiladi
- [x] **Istalgan user istalgan qo'ng'iroqni tugata oladi** — `call.gateway.ts` `endCall` va `calls.service.ts` `end` participant/initiator tekshiruvisiz

## Kritik — auth mantiq xatolari

- [x] **Logout refresh tokenni o'chirmaydi** — `auth.service.ts` `logout`: `update(userId, { refreshToken: undefined })` — TypeORM `undefined` maydonlarni e'tiborsiz qoldiradi, token DBda qoladi va logoutdan keyin ham `refresh` ishlayveradi. `null` ishlatish kerak
- [x] **2FA o'chirilganda secret DBda qoladi** — xuddi shu bug: `disableTwoFa`da `twoFaSecret: undefined` → o'chmaydi
- [x] **Tasdiqlash kodlariga brute-force himoyasi yo'q** — `verifyEmail`, `resetPassword`, `verifyTwoFaLogin` — urinishlar soni cheklanmagan, 6 xonali kodni (10^6) 10 daqiqa ichida terib chiqish mumkin. Urinish counteri + limit kerak
- [x] **Parol o'zgarganda eski sessiyalar bekor qilinmaydi** — `changePassword`/`resetPassword` refresh tokenni o'chirmaydi va access tokenlarni blacklist qilmaydi
- [x] **Google callback brauzerga JSON qaytaradi** — `auth.controller.ts` `googleCallback` redirect qilmaydi, tokenlar frontendga yetib bormaydi — OAuth flow amalda ishlamaydi

## Yuqori

- [x] **RolesGuard ishlamaydi** — `roles.guard.ts` `user.role`ni tekshiradi, lekin `User` entityda `role` maydoni yo'q (rol `GroupMember`da) — guard qo'llangan joyda doim rad etadi yoki umuman ishlatilmayapti
- [x] **register race condition** — findOne + save orasida parallel so'rov unique constraint (23505) xatosini beradi va 500 bo'lib qaytadi; catch qilib ConflictException'ga aylantirish kerak
- [x] **Guruh to'lganlik tekshiruvi tranzaksiya tashqarisida** — `groups.service.ts` `join`: `memberCount >= maxMembers` check race'da limit oshib ketishiga yo'l qo'yadi
- [x] **WS auth to'liq emas** — `ws-jwt.guard.ts` va gateway `handleConnection`lar blacklist hamda `isActive`ni tekshirmaydi (HTTP `JwtStrategy` tekshiradi) — bloklangan token WS orqali ishlayveradi
- [x] **RedisService.subscribe listener leak** — har chaqiruvda `subscriber.on('message', ...)` yangi listener qo'shadi; bitta global listener + channel→handler map kerak
- [x] **online_users noto'g'ri** — bitta user 2 ta device bilan ulansa, bittasi uzilganda `srem` bilan butunlay offline bo'lib qoladi; socket count (Redis hash/incr) kerak
- [x] **Media: MIME type clientdan ishonilgan** — magic-bytes tekshiruvi yo'q; rasm webp'ga konvert qilinadi, lekin original extension va original ContentType bilan saqlanadi (`uploadFile` `processedBuffer`ni `mimeType` bilan yuklaydi); animated GIF animatsiyasi yo'qoladi
- [x] **Video /tmp fayllari tozalanmaydi** — `enqueueVideo` `/tmp`ga yozadi, job fail bo'lsa fayl qoladi; scratchpad/tozalash strategiyasi kerak. Barcha fayllar `ACL: public-read` bilan yuklanadi — shaxsiy hujjatlar ham ochiq
- [x] **`CallsService.end`da noto'g'ri criteria** — `update({ callId, leftAt: undefined }, ...)` — `undefined` criteria tashlab yuboriladi va BARCHA participantlarning `leftAt`i qayta yoziladi; `IsNull()` ishlatish kerak
- [x] **Xabar tahrirlanganda search index yangilanmaydi** — `messages.service.ts` `edit` `indexDocument` chaqirmaydi — qidiruvda eski kontent qoladi
- [x] **WS payloadlar validatsiyasiz** — `chat.gateway.ts` `handleSendMessage` `data`ni `as any` bilan servisga uzatadi; WS uchun DTO + ValidationPipe yo'q

## O'rta

- [x] `markRead` natijasi chat roomga broadcast qilinmaydi — boshqa userlarda "o'qildi" statusi real-time yangilanmaydi
- [x] Login fail counter faqat email bo'yicha — attacker atayin 5 marta noto'g'ri urinib, egasini 15 daqiqaga bloklab qo'yishi mumkin (lockout DoS); IP+email kombinatsiyasi ma'qul
- [x] `calls history` faqat initiator bo'lgan qo'ng'iroqlarni qaytaradi — participant sifatida qatnashganlar tarixda ko'rinmaydi
- [ ] Socket.io Redis adapter yo'q — bir nechta instance'ga scale qilinganda roomlar/broadcastlar ishlamaydi (infra masalasi, bitta instance'da muammo emas — deploy'da @socket.io/redis-adapter qo'shish kerak)
- [x] Gatewaylarda `cors: { origin: '*' }` — HTTP CORS siyosati bilan zid; `NODE_ENV=development`da HTTP CORS ham hamma originga ochiq
- [x] `database.config.ts` `synchronize: NODE_ENV !== 'production'` — migratsiya yondashuvi bilan zid, staging/undefined muhitda schema sync yoqilib qoladi
- [x] `HttpExceptionFilter` 500 xatolarda stack/exception log qilmaydi — production diagnostikasi imkonsiz; ValidationPipe xatosida `message` massiv bo'lib qaytadi (formatlash kerak)
- [x] `GET /users/:id` email kabi shaxsiy maydonlarni hammaga qaytaradi — public profil DTO ajratish kerak
- [x] `users.service.ts` `search` — `Like('%q%')`da `%`/`_` belgilari escape qilinmaydi
- [x] Admin guruhdan chiqib ketsa guruh adminsiz qoladi (`leave`da rol tekshiruvi/ownership transfer yo'q); oxirgi a'zo chiqsa ham guruh o'chirilmaydi

## Frontend integratsiyasida topilgan (2026-07-21)

- [x] **MUHIM: barcha 21 ta timestamp ustuni `timestamp without time zone` edi — TUZATILDI (2026-07-21)** — vaqtlar noto'g'ri qaytadi. `CreateDateColumn` Postgres'ning lokal vaqtini (`TimeZone=Asia/Samarkand`, UTC+5) timezone ma'lumotisiz saqlaydi; TypeORM/pg uni o'qiganda **Node process'ining** timezonasida (UTC+1) talqin qiladi va UTC'ga o'giradi. Natijada yangi yaratilgan post `createdAt` maydonida **4 soat kelajakda** ko'rinadi (`2026-07-21T18:33:42.895Z`, haqiqiy vaqt `14:33Z`). Frontend'da "hozirgina" o'rniga "+4 soat" chiqadi. Ta'sir doirasi: `posts`, `comments`, `messages`, `notifications`, `groups`, `channels`, `goals`, `users.created_at`/`last_seen`, `calls`, va barcha `joined_at`/`subscribed_at` ustunlari. **Bu shunchaki ko'rinish muammosi emas** — `messages` va `posts/:id/comments` cursor pagination aynan `createdAt` ISO qiymatiga tayanadi, ya'ni sahifalash chegaralari ham siljigan. Bajarildi: (1) 17 ta entity faylida barcha sana ustunlariga `type: 'timestamptz'` qo'shildi; (2) `1753106400000-TimestampsToTimestamptz.ts` migratsiyasi yozildi — 21 ta ustunni `USING "col" AT TIME ZONE current_setting('TimeZone')` bilan konvertatsiya qiladi (naive qiymatlar `now()` bilan sessiya zonasida yozilgani uchun bu to'g'ri talqin); (3) `synchronize` o'chirildi (pastga qarang); (4) `npm run typeorm` skripti `tsconfig-paths/register` bilan tuzatildi — aks holda `@/` aliaslari tufayli migratsiya umuman ishlamasdi. Tekshirildi: yangi post `createdAt` haqiqiy vaqtdan 2 soniya farq qiladi (avval 4 soat edi).

- [x] **`synchronize: NODE_ENV === 'development'` MA'LUMOTNI YO'Q QILDI — o'chirildi.** Yuqoridagi entity o'zgarishidan keyin watch rejimidagi backend qayta yuklandi va TypeORM ustunlarni avtomatik `ALTER` qildi — lekin `DROP COLUMN` + `ADD COLUMN` yo'li bilan, ya'ni **barcha mavjud `created_at` qiymatlari `now()` defaultiga tenglashdi va asl vaqtlar yo'qoldi** (dev bazasi bo'lgani uchun zarar sezilarli emas). `database.config.ts` da `synchronize: false` qilindi — loyiha migratsiyalarga tayanadi, ikkalasi bir vaqtda ishlashi xavfli.
- [ ] `POST /posts/:id/comments` javobida eager `author` relation yo'q — TypeORM `save()` yaratilgan entity'ni relation'siz qaytaradi. Frontend hozircha muallifni joriy foydalanuvchidan to'ldirib turibdi; backend `save()` dan keyin `findOne`ga o'tsa, bu vaqtinchalik yechim olib tashlanadi.
- [ ] `GET /posts/:id` `isLiked` qaytarmaydi (faqat `GET /posts/feed` qaytaradi) — detail sahifa qo'shimcha `GET /posts/:id/liked` chaqirishga majbur.
- [ ] Ro'yxat endpointlari (`/goals`, `/groups`, `/channels`) joriy foydalanuvchi a'zoligini qaytarmaydi — frontend har sahifada qo'shimcha `/my` so'rovi bilan hisoblaydi.
