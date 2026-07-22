# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ConnectHub backend: a NestJS 10 + TypeScript + PostgreSQL (TypeORM) + Redis service for a goal-oriented social/chat app (goals → groups/channels → real-time messages/posts → calls). Full spec lives in `ConnectHub — Backend (NestJS) TZ 353645e8d1678165b59fc52a8abe05fa.md` at the repo root — that document is the source of truth for entity shapes, API endpoints, and the original architecture; the "Code Review & Tavsiyalar" section at its end lists known bugs/fixes that have already been applied in `src/` (see "Known fixes" below).

## Commands

```bash
npm install                  # install deps (uses --ignore-scripts in this sandbox if native builds fail)
npm run start:dev            # nest start --watch
npm run build                # nest build
npm run lint                 # eslint --fix on src/apps/libs/test
npm run seed                 # ts-node seed — inserts admin user + 5 goals (idempotent)

npm test                     # jest unit tests (rootDir: src, pattern *.spec.ts)
npm run test:watch
npm run test:cov
npx jest path/to/file.spec.ts          # run a single unit test file
npx jest -t "test name"                # run tests matching a name

npm run test:e2e             # jest --config ./test/jest-e2e.json (test/*.e2e-spec.ts)

npm run migration:generate   # typeorm migration:generate -d src/config/data-source.ts
npm run migration:run        # applies pending migrations
npm run migration:revert     # reverts last migration
```

TypeScript path alias `@/*` → `src/*` is configured in `tsconfig.json` and mirrored in the Jest `moduleNameMapper` in `package.json`. Use `@/...` imports for anything outside the current module.

There is no Docker available for local verification in this sandbox; `docker-compose.yml` defines `api`, `postgres`, `redis`, `elasticsearch`, `minio`, `nginx` services for real deployment.

## Architecture

**Module shape.** Every feature lives under `src/modules/<name>/` with `entities/`, `dto/`, `<name>.service.ts`, `<name>.controller.ts`, `<name>.module.ts`, and (for real-time features) `gateways/`. `app.module.ts` wires all feature modules together plus global `ConfigModule`, `TypeOrmModule`, `ThrottlerModule` (3 named tiers: short/medium/long), and `ScheduleModule`. `JwtAuthGuard` is registered as a global `APP_GUARD` — **every endpoint requires a valid JWT by default**; opt out per-route with the `@Public()` decorator (`src/common/decorators/public.decorator.ts`), checked via Reflector in the guard.

**Auth flow.** Argon2 password hashing happens in `User`'s `@BeforeInsert` hook (`src/modules/users/entities/user.entity.ts`), not in the service layer. Access + refresh JWTs are issued together (`AuthService.generateTokens`); refresh tokens are hashed with argon2 before being persisted on the user row and compared with `argon2.verify` on refresh — never compared as plaintext. Two passport strategies (`jwt.strategy.ts`, `jwt-refresh.strategy.ts`) plus an optional `google.strategy.ts`.

**WebSocket gateways are namespaced and authenticate independently of HTTP guards** — `ChatGateway` (`namespace: 'chat'`), `CallGateway` (`namespace: 'calls'`), `NotificationGateway` (`namespace: 'notifications'`). Each verifies the JWT itself from `client.handshake.auth.token` in `handleConnection` (gateways don't go through `JwtAuthGuard`). Per-message-handler auth uses `WsJwtGuard` (`src/common/guards/ws-jwt.guard.ts`), which caches the verified payload on `client.data.user` so it only verifies once per connection. Because `JwtModule` is registered globally only inside `AuthModule`, every module that owns a gateway re-registers `JwtModule.register({})` locally (see `messages.module.ts`, `calls.module.ts`, `notifications.module.ts`) — keep doing this pattern for any new gateway rather than relying on a global import.

**Goal → Group/Channel → Message hierarchy.** `Goal` has many `Group`s; `Group`/`Channel` membership is tracked in join entities (`GroupMember`, `ChannelSubscriber`) with a denormalized `memberCount` column on the parent for fast listing. Any mutation of membership (`groups.service.ts` `create`/`join`/`leave`) **must** go through `DataSource.transaction` and `manager.increment`/`decrement` on `memberCount` — never update membership and the counter in separate non-transactional calls, since that was an identified bug in the original TZ (see "Known fixes").

**Messages vs. Posts** are deliberately separate modules: `Message` is for ephemeral, high-volume group/channel chat (cursor-paginated via `createdAt` + `LessThan`, soft-deleted via `isDeleted`), while `Post` is for pinned/feed-style content with comments and likes. Don't merge them — they have different pagination, retention, and moderation needs per the TZ.

**Media processing** (`media.service.ts`) is synchronous inline processing (sharp for images, fluent-ffmpeg for video thumbnails) directly in the request path, uploading both the processed asset and a generated thumbnail to S3/MinIO. If this becomes a bottleneck, the TZ's intended evolution is to move it behind a BullMQ queue (`bullmq` is already a dependency) rather than rewriting the upload contract.

**Search** (`search.service.ts`) talks to Elasticsearch and is optional at boot — `onModuleInit` no-ops if `ELASTICSEARCH_URL` is unset, so the rest of the app must keep working without it. The TZ's own recommendation is to defer Elasticsearch and use PostgreSQL full-text search (`to_tsvector`/`plainto_tsquery`) for MVP; if you implement that fallback, keep `SearchService`'s public method signatures (`search`, `indexDocument`, `deleteDocument`) stable so callers don't need to change.

**Call discovery is a REST + notification concern, not a `/calls` gateway concern.** `CallGateway` only serves peers who are *already* participants (`joinCallRoom` checks `isParticipant`, which requires a prior `POST /calls/:id/join`), so nothing in that namespace can tell a user a call has started. That job belongs to `CallsService.create()`, which imports `ChatMembershipService` (from `MessagesModule`) and `NotificationsService` + `NotificationGateway` (from `NotificationsModule`) to write a `NotificationType.CALL` row and emit `incomingCall` on the **`/notifications`** namespace to every chat member except the initiator; `end()` symmetrically emits `callEnded` there so clients showing an "ongoing call" banner can clear it. `GET /calls/active?chatId=` is the cold-load equivalent for a client that was offline when the call started. Keep new call-lifecycle broadcasts on `/notifications` — putting them on `/calls` recreates the original chicken-and-egg bug. `create()` is also membership-checked and idempotent per chat (an existing `ongoing` call is returned and joined rather than duplicated), so the frontend can treat "start call" as safe to press twice.

**Calls** (`calls.module.ts`, `webrtc.service.ts`, `gateways/call.gateway.ts`). `WebRTCService` runs a real mediasoup `Worker` pool — one worker per `os.cpus().length`, created in `OnModuleInit` — and assigns each call's `Router` to the least-loaded worker (`getLeastLoadedWorker`/`getOrCreateRoom`); everything is closed gracefully in `OnModuleDestroy`. Each peer gets at most one send + one recv `WebRtcTransport` per call (tracked in `PeerState`, looked up via flat `transportsById`/`producersById`/`consumersById` maps since `connectTransport`/`produce`/`resumeConsumer` only receive an id from the client, not the callId). `CallsService.create`/`end` own the room lifecycle (`createRouter`/`closeRoom`) so the REST endpoints manage media state too, not just `CallGateway`; the gateway additionally exposes `consume`/`resumeConsumer`/`getProducers` and cleans up a peer's transports on `leaveCallRoom`/disconnect via `closePeer`. mediasoup's native worker binary isn't buildable in this sandbox (no Rust toolchain/Docker) — `webrtc.service.spec.ts` mocks the `mediasoup` package entirely; real end-to-end signaling needs a real environment.

## Migration & seeds

`src/config/data-source.ts` exports a `DataSource` for TypeORM CLI — all migration scripts point there, not to `database.config.ts`. The initial migration `1750720800000-InitSchema.ts` covers all 13 tables with proper FK ordering and enum types. Run `npm run migration:run` on a fresh DB before `npm run seed`.

`src/database/seeds/seed.ts` is idempotent — safe to run multiple times. Creates `admin@connecthub.app / Admin123!` and 5 seed goals.

## Known fixes already applied (don't reintroduce these bugs)

The TZ document's own "Code Review & Tavsiyalar" section flagged five issues in the original design; all are fixed in this codebase:
- `ChatGateway` now injects `usersRepo` (`@InjectRepository(User)`) to track `lastSeen` — the original TZ gateway never injected it.
- `Group.memberCount` mutations are transactional (see Architecture above), not fire-and-forget increments.
- `WsJwtGuard` does real `JwtService.verify(...)` against `JWT_SECRET` — the original TZ gateway had `verifyToken` unimplemented.
- `MEDIASOUP_MIN_PORT`/`MEDIASOUP_MAX_PORT` in `.env.example` is `10000`–`20000` (10k ports), not the original `10000`–`10100` (100 ports, ~50 concurrent calls max).
- `REDIS_PASSWORD` in `.env.example` has a non-empty placeholder (`CHANGE_ME_IN_PRODUCTION`) instead of being blank.

## Build order (per TZ's own phasing recommendation)

The TZ explicitly warns this is 3–6 months of work for one developer and should not be built all at once. Build/extend in this order, and defer mediasoup and Elasticsearch as long as possible:
1. **Foundation** — Auth, Users, JWT guards
2. **Core Chat** — Groups, Messages, Socket.io gateway
3. **Media** — upload, S3/MinIO
4. **Content** — Posts, Channels, Notifications
5. **Search** — Elasticsearch (or Postgres FTS as a lighter substitute)
6. **Calls** — mediasoup, WebRTC

All six modules already have scaffolded code in this repo; "build in this order" means *harden and finish* in this order (real mediasoup integration, real search backend, migrations, tests) rather than treating everything as equally production-ready.

## Sandbox/environment quirk

The mounted project directory has a filesystem that does not support `unlink` on certain `.git/*.lock` files once they're created (stale locks from interrupted git processes can't be `rm`'d, even by their owner). If `git add`/`git commit` fails with `Unable to create '.git/index.lock': File exists` and `rm` on the lock fails with `Operation not permitted`, work around it without touching the stuck lock files:
```bash
GIT_INDEX_FILE=/tmp/newindex git add -A
TREE=$(GIT_INDEX_FILE=/tmp/newindex git write-tree)
COMMIT=$(git commit-tree "$TREE" -p $(git rev-parse HEAD) -m "...")
echo "$COMMIT" > .git/refs/heads/master   # overwrite, don't delete-then-create
cat /tmp/newindex > .git/index            # sync real index so `git status` is accurate
```

## Timestamps

All date columns are `timestamptz` (migration `1753106400000-TimestampsToTimestamptz`). Declare new ones as `@CreateDateColumn({ name: '...', type: 'timestamptz' })` — a plain `@CreateDateColumn()` produces `timestamp without time zone`, which stores the DB session's local wall-clock with no offset. The pg driver then reads it back in the **Node process's** timezone, so the value silently shifts by the difference between the two (this shipped a 4-hour skew: posts appeared to be created in the future, and the cursor pagination in `messages` / `posts/:id/comments` keys off `createdAt`, so page boundaries were wrong too).

## synchronize is off, permanently

`database.config.ts` sets `synchronize: false` in every environment. It used to be on in development, and when an entity's column type changed, TypeORM "migrated" it with `DROP COLUMN` + `ADD COLUMN` — silently wiping every existing value in that column. This project uses migrations; run `npm run migration:run` instead. Note `npm run typeorm` invokes the CLI through `ts-node -r tsconfig-paths/register` because entities import via the `@/*` alias — without that registration every migration command fails with `Cannot find module '@/modules/...'`.
