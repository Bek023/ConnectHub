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

## Bosqich 5 — Search ✅

- [x] `SearchService` — ES mavjud bo'lsa Elasticsearch, aks holda PostgreSQL FTS (`to_tsvector`/`plainto_tsquery`) fallback; `onModuleInit`da `ping()` bilan tekshiriladi
- [x] `indexDocument`/`deleteDocument` — ES o'chirilganda silent no-op; signature'lar o'zgarmadi
- [x] `GoalsService` — create/update/remove da avtomatik indekslash
- [x] `GroupsService` — create/update/remove da avtomatik indekslash
- [x] `MessagesService` — create (matnli xabarlar) va soft-delete da indekslash
- [x] `GoalsModule`, `GroupsModule`, `MessagesModule` — `SearchModule` import qildi
- [x] `search.service.spec.ts` — ES o'chirilgan (PG fallback), ES ping fail, ES yoniq holatlari

## Bosqich 6 — Calls (mediasoup, WebRTC) ✅

- [x] `WebRTCService` — haqiqiy mediasoup Worker/Router/WebRtcTransport/Producer/Consumer lifecycle yozildi (`src/modules/calls/webrtc.service.ts`)
- [x] mediasoup worker pool — `os.cpus().length` ga qarab worker yaratiladi, router'lar least-loaded worker'ga round-robin tarqatiladi; `OnModuleDestroy`da barcha router/worker yopiladi (graceful shutdown)
- [x] `CallGateway` to'liq signaling oqimi — `joinCallRoom` endi `rtpCapabilities` + mavjud `producers` ro'yxatini qaytaradi; `consume`/`resumeConsumer`/`getProducers` handlerlari qo'shildi; `handleDisconnect` orqali peer transport/producer/consumer tozalanadi
- [x] `CallsService.create`/`end` — router yaratish va xonani yopish endi REST (`/calls/initiate`, `/calls/:id/end`) orqali ham ishlaydi, faqat WS orqali emas
- [x] `webrtc.service.spec.ts` va `calls.service.spec.ts` — worker pool, router lazy-create, transport/producer/consumer lifecycle, xato holatlari (NotFound/BadRequest) uchun testlar

**Qolgan (deploy vaqtida):**
- [ ] `CallGateway` orqali signaling oqimini real socket.io-client + 2 ta brauzer/peer bilan end-to-end sinash (Docker va real network kerak, bu sandbox'da mediasoup-worker native binary ishlamaydi)
- [ ] `MEDIASOUP_ANNOUNCED_IP`ni production serverning haqiqiy public IP'siga o'rnatish

## Infratuzilma / umumiy
- [ ] Real Docker Compose stack'ni ishga tushirib (`postgres`, `redis`, `elasticsearch`, `minio`) to'liq smoke test o'tkazish — bu sandbox'da Docker yo'q, faqat real muhitda tekshiriladi
- [ ] `nginx/nginx.conf` — SSL/TLS sozlamalari yo'q (`ssl/` papkasi bo'sh, faqat `.gitkeep`); production uchun sertifikat ulash kerak
- [x] CI pipeline — `.github/workflows/ci.yml` qo'shildi: `lint` (`lint:check`, mutatsiyasiz), `build`, `test` (unit) jobs har bir push/PR'da ishlaydi; `test-e2e` job Postgres+Redis service container bilan `test/app.e2e-spec.ts`ni haqiqiy DB'ga ulanib ishga tushiradi. **MUHIM:** `npm run lint`ning o'zi `--fix` bilan ishlaydi — CI'da shuni ishlatish noto'g'ri (muammolarni jim tuzatib, haqiqiy holatni yashiradi); shu sabab alohida mutatsiyasiz `lint:check` skripti qo'shildi va CI faqat shuni ishlatadi
- [x] Repo bo'ylab `eslint --fix` ishlatildi (62 avtomatik tuzatiladigan prettier xatosi) + 10 ta haqiqiy `no-unused-vars`/`no-var-requires` xato qo'lda tuzatildi (`media.controller.ts`, `video.processor.ts`, `ws-exception.filter.ts`, `auth.service.spec.ts`, `search.service.spec.ts`); `.eslintrc.js`ga `argsIgnorePattern: '^_'` qo'shildi — kodda allaqachon ishlatilgan `_param` konventsiyasini ESLint endi to'g'ri tanийdi
- [ ] Loglash/monitoring: `winston`/`nest-winston` paketlari `package.json`da bor, lekin hali hech bir joyda ulanmagan
- [ ] Umumiy unit-test qamrovi: `auth.service.spec.ts` va `users.service.spec.ts` qo'shildi — qolgan modullar uchun spec fayllar yo'q
- [x] `package.json`da noto'g'ri paket bor edi — kod `@nestjs/bullmq`dan import qiladi, lekin eski `@nestjs/bull` (10.1.0) o'rnatilgan edi; `@nestjs/bullmq@^10.2.3`ga almashtirildi, `npm run build` endi xatosiz o'tadi
- [x] `media.service.spec.ts(132)` — `assertHasProcessingJobId` type-guard (assertion function) qo'shildi, `result.processingJobId`ga xavfsiz murojaat qilish uchun
- [x] **MUHIM (production bug):** `tsconfig.json`da `esModuleInterop` yo'q edi — shu sababli `sharp` (`media.service.ts`) va `fluent-ffmpeg` (`video.processor.ts`) default importlari compiled `dist/`da `X.default` ga murojaat qiladi, lekin haqiqiy paketlarda `.default` yo'q (faqat `helmet`/`ioredis` da bor). Demak **rasm va video thumbnail processing production'da `TypeError: ...default is not a function` bilan yiqilardi**. `esModuleInterop: true` qo'shildi — bu muammoni tubdan tuzatadi (faqat test mock emas). Bonus: shu o'zgarish tufayli `test/app.e2e-spec.ts`dagi eski-uslub `import * as request from 'supertest'` runtime'da chaqirib bo'lmaydigan holatga kelardi — `import request from 'supertest'`ga to'g'rilandi
- [x] `groups.service.spec.ts` va `messages.service.spec.ts` — `SearchService` mock provideri qo'shildi (`indexDocument`/`deleteDocument`); `create`/`delete` testlariga indekslash chaqirilganini tekshiradigan assertionlar qo'shildi
- [x] **MUHIM (production bug, CI `test-e2e` orqali topildi):** `mail.config.ts` `@nestjs-modules/mailer/dist/adapters/handlebars.adapter`dan import qilardi — bu paket `exports` xaritasida yo'q yo'l (faqat `./adapters/*` ochiq, `./dist/adapters/*` emas). `tsc`ning classic module resolution'i buni sezmaydi (fayl diskda bor), lekin Node'ning haqiqiy `require()`'i `exports`ni qattiq qo'llaydi — demak **`AuthModule`/`MailModule` orqali butun ilova production'da boot bo'lishda yiqilardi**. `@nestjs-modules/mailer/adapters/handlebars.adapter`ga to'g'rilandi. Bu xato faqat `test-e2e` job haqiqiy `AppModule`ni yuklagani uchun topildi — unit testlar va `tsc --noEmit` buni hech qachon ushlay olmaydi
- [x] **MUHIM (production bug, CI `test-e2e` orqali topildi):** `package.json`da `"mediasoup": "^3.13.15"` eng so'nggi mos versiyani (3.20.9) o'rnatardi, lekin mediasoup `3.19.4`dan boshlab `engines.node: >=22` talab qiladi — bizning `Dockerfile` esa `node:20-alpine` ishlatadi. `mediasoup`ni `3.19.3`ga (oxirgi Node 20 bilan mos versiya) qattiq pin qilindi — API (`createWorker`/`createWebRtcTransport`/`canConsume` va h.k.) o'zgarmagan, tasdiqlandi. **Bu o'zi yetarli emas edi** — versiyani tuzatgandan keyin ham `test-e2e` xuddi shu joyda osilib qolishda davom etdi (qarang keyingi band)
- [x] **MUHIM (production bug, CI `test-e2e` orqali topildi):** `WebRTCService.onModuleInit()`da `mediasoup.createWorker()` chaqirilganda **butun ilova abadiy osilib qolardi** (xato chiqmaydi, shunchaki hech qachon javob bermaydi; GitHub Actions job'ni "orphan process" sifatida majburan o'chirishga to'g'ri keldi). Sabab: mediasoup-worker (Rust) Linux'da standart holatda `io_uring` ishlatadi, lekin ko'pgina sandbox/CI muhitlari (jumladan GitHub Actions runner'lari) `io_uring_setup` syscall'ini seccomp orqali bloklaydi — bu hatkalik sezilmasdan abadiy kutishga olib keladi (xato emas). `mediasoup.createWorker({..., disableLiburing: true})` qo'shildi (`WorkerSettings`ning rasmiy flag'i, "Disable liburing (io_uring) despite it's supported in current host"). Bu xato `npm test`/`tsc`da hech qachon sezilmaydi, chunki unit testlar `mediasoup`ni to'liq mock qiladi — faqat haqiqiy worker process spawn qiladigan `test-e2e` buni topa oldi
- [x] **MUHIM (production bug, CI `test-e2e` orqali topildi):** `app.module.ts`da `TypeOrmModule.forRootAsync({ useFactory: databaseConfig })` — `inject: [ConfigService]` yo'q edi. Demak Nest `databaseConfig`ni **hech qanday argumentsiz** chaqirardi, `config` parametri `undefined` bo'lardi va `config.get('DB_HOST', ...)` xato berardi — **ilova haqiqiy Postgres bilan birorta ham marta muvaffaqiyatli boot bo'lmagan edi**. `MailerModule`/`BullModule`ning o'zidagi `forRootAsync`larda `inject: [ConfigService]` to'g'ri yozilgan edi — faqat `TypeOrmModule`da yo'q edi. `test/jest-e2e.json`ga `testTimeout: 15000` va `test:e2e` skriptiga `--forceExit` qo'shilgandan keyin bu xato aniq stack trace bilan tezda chiqdi (ilgari `disableLiburing` muammosi bilan birga osilib, ko'rinmasdi)

## Git/Deploy
- [ ] Sandbox'dagi `.git` lock muammosi tufayli branch nomi hali `master` (`main`ga o'tkazib bo'lmadi) — imkon bo'lsa real mashinada `git branch -m main` qilib qo'yish
- [x] GitHub Actions CI/CD ulandi — `.github/workflows/ci.yml`
