# TODO — ConnectHub Backend

Joriy holat: barcha modullar scaffold qilingan va `tsc --noEmit` xatosiz o'tadi, lekin TZ'ning "Build order" bosqichlariga ko'ra ko'p joy hali **stub/MVP darajasida**. Quyida bosqichlar bo'yicha qolgan ishlar.

## Bosqich 1 — Foundation (Auth, Users) ✅

- [x] `.env` faylini haqiqiy qiymatlar bilan to'ldirish — `.env` yaratildi (development defaults)
- [x] `src/config/data-source.ts` — TypeORM CLI uchun `DataSource` eksport qilindi; `package.json` migration skriptlari yangilandi
- [x] `src/database/migrations/1750720800000-InitSchema.ts` — barcha jadvallar uchun to'liq initial migration yozildi (`synchronize` o'rniga)
- [x] `src/database/seeds/seed.ts` — admin user + 5 ta goal uchun seed skript yozildi (`npm run seed`)
- [x] Google OAuth flow — `AuthService.googleLogin`, `/auth/google`, `/auth/google/callback` endpointlari va `GoogleStrategy` `AuthModule`ga ro'yxatdan o'tkazildi; haqiqiy `GOOGLE_CLIENT_ID/SECRET` `.env`ga qo'shish kerak
- [x] Unit testlar — `auth.service.spec.ts` va `users.service.spec.ts` yozildi (register, login, refresh, logout, verifyEmail, findById, updateMe, deleteMe, search)

**Qolgan (deploy vaqtida):**
- [ ] Real PostgreSQL'ga ulanib `npm run migration:run` ishlatish
- [ ] `npm run seed` — real DB'ga seed data kiritish
- [ ] Haqiqiy `GOOGLE_CLIENT_ID/SECRET` qo'shish va frontend bilan redirect flow'ni sinash

## Bosqich 2 — Core Chat (Groups, Messages, Gateway) ✅

- [x] `MessageRead` entity yaratildi (`src/modules/messages/entities/message-read.entity.ts`) — unique(message_id, user_id) constraint bilan
- [x] Migration `1750807200000-AddMessageReads.ts` — `message_reads` jadvali qo'shildi
- [x] `MessagesService.markRead` — real DB write (idempotent); `readBy` — haqiqiy ma'lumot qaytaradi
- [x] `markRead` WS event `ChatGateway`ga qo'shildi
- [x] `sendMessage` WS handlerga `@Throttle` qo'shildi (20 msg/min)
- [x] `groups.service.spec.ts` — create/join/leave transaction mantiqi, memberCount increment/decrement, rol tekshiruvi
- [x] `messages.service.spec.ts` — create/edit/delete/react (toggle)/markRead/readBy

**Qolgan:**
- [ ] `ChatGateway` e2e/integration test — socket.io-client orqali real ulanish testi (Docker kerak)

## Bosqich 3 — Media (Upload, S3/MinIO)
- [ ] Haqiqiy S3/MinIO bucket bilan `media.service.ts`ni sinab ko'rish (hozir faqat kompilyatsiya darajasida tekshirilgan)
- [ ] Katta video fayllar uchun BullMQ queue'ga o'tish (TZ tavsiyasi — hozir so'rov ichida sinxron `fluent-ffmpeg` ishlaydi, bottleneck bo'lishi mumkin)
- [ ] Fayl turi/hajm limitlarini frontend bilan kelishish va xato xabarlarini aniqlashtirish

## Bosqich 4 — Content (Posts, Channels, Notifications)
- [ ] `PostsService.like/unlike` — hozir in-memory `Map` orqali ishlaydi (server qayta ishga tushsa yo'qoladi); haqiqiy `post_likes` jadvaliga o'tish kerak
- [ ] `CallsService.getParticipants()` va umuman call ishtirokchilari uchun `call_participants` jadvali yo'q
- [ ] `NotificationsService.registerPushToken()` — stub; Firebase FCM token saqlash uchun jadval/entity kerak
- [ ] Push notification yuborishni haqiqiy FCM/APNs integratsiyasi bilan ulash

## Bosqich 5 — Search
- [ ] Hozircha faqat Elasticsearch yo'li yozilgan (`search.service.ts`); TZ tavsiyasiga ko'ra MVP uchun PostgreSQL FTS (`to_tsvector`/`plainto_tsquery`) fallback yozish kerak, `SearchService`ning `search/indexDocument/deleteDocument` signature'larini saqlab qolgan holda
- [ ] Goal/Group/Message yaratilganda/yangilanganda Elasticsearch indeksiga avtomatik yozish (hozir hech qayerdan `indexDocument` chaqirilmaydi)

## Bosqich 6 — Calls (mediasoup, WebRTC)
- [ ] `WebRTCService` to'liq stub — haqiqiy mediasoup worker/router/transport/producer/consumer lifecycle yozilmagan
- [ ] mediasoup worker pool boshqaruvi (CPU core'larga qarab) va graceful shutdown
- [ ] `CallGateway` orqali signaling oqimini real mediasoup bilan end-to-end sinash

## Infratuzilma / umumiy
- [ ] Real Docker Compose stack'ni ishga tushirib (`postgres`, `redis`, `elasticsearch`, `minio`) to'liq smoke test o'tkazish — bu sandbox'da Docker yo'q, faqat real muhitda tekshiriladi
- [ ] `nginx/nginx.conf` — SSL/TLS sozlamalari yo'q (`ssl/` papkasi bo'sh, faqat `.gitkeep`); production uchun sertifikat ulash kerak
- [ ] CI pipeline (lint + test + build) — hozir loyiha workflow'i yo'q
- [ ] Loglash/monitoring: `winston`/`nest-winston` paketlari `package.json`da bor, lekin hali hech bir joyda ulanmagan
- [ ] Umumiy unit-test qamrovi: `auth.service.spec.ts` va `users.service.spec.ts` qo'shildi — qolgan modullar uchun spec fayllar yo'q

## Git/Deploy
- [ ] Sandbox'dagi `.git` lock muammosi tufayli branch nomi hali `master` (`main`ga o'tkazib bo'lmadi) — imkon bo'lsa real mashinada `git branch -m main` qilib qo'yish
- [ ] GitHub Actions yoki boshqa CI/CD ulash
