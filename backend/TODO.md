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

## Bosqich 3 — Media (Upload, S3/MinIO) ✅

- [x] Video thumbnail generatsiyasi BullMQ queue'ga (`VideoProcessor`) ko'chirildi — ffmpeg endi request path'ida bloklamaydi
- [x] `MediaModule` BullMQ ni Redis config bilan `forRootAsync` orqali ro'yxatdan o'tkazdi
- [x] `MediaService.uploadFile` — video uchun `processingJobId` qaytaradi, thumbnail async yaratiladi
- [x] Aniq xato xabarlari: noto'g'ri mime type (ruxsat etilganlar ro'yxati bilan), hajm limiti, bo'sh fayl
- [x] S3Client'ga `forcePathStyle: true` qo'shildi (MinIO bilan moslik uchun)
- [x] `DELETE /media/:key` va `GET /media/presigned/:key` endpointlari qo'shildi
- [x] `media.service.spec.ts` — image/video/voice/file upload, validation, delete, presign testlari

**Qolgan (deploy vaqtida):**
- [ ] Real MinIO bucket bilan smoke test o'tkazish (`docker-compose up` + manual upload test)

## Bosqich 4 — Content (Posts, Channels, Notifications) ✅

- [x] `PostLike` entity — `post_likes` jadvali (unique post_id+user_id); like/unlike `DataSource.transaction` ichida
- [x] `GET /posts/:id/liked` — foydalanuvchi like bosganligini tekshirish
- [x] `CallParticipant` entity — `call_participants` jadvali; join/leave/end real DB yozadi
- [x] `DELETE /calls/:id/leave` endpoint qo'shildi
- [x] `PushToken` entity — `push_tokens` jadvali (ios/android/web platform enum); `registerPushToken` upsert qiladi
- [x] `removePushToken` qo'shildi
- [x] Migration `1750893600000-AddStage4Tables` — 3 ta yangi jadval
- [x] `posts.service.spec.ts` — like/unlike transaction, isLiked, addComment, pin/unpin
- [x] `notifications.service.spec.ts` — findAll, create, markRead, registerPushToken upsert

**Qolgan:**
- [ ] Firebase FCM/APNs orqali haqiqiy push notification yuborish (FCM credentials kerak)

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
