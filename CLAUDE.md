# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ConnectHub monorepo — `backend/` (NestJS + PostgreSQL + Redis) and `frontend/` (Angular 22 web app). Each has its own `CLAUDE.md` with stack-specific detail; read the one for the side you're working on. The frontend was rewritten from Flutter to Angular on 2026-07-21 — anything referencing Dart/Flutter in older artifacts (git history, a stale knowledge graph) predates that rewrite.

## Knowledge graph (graphify) — required workflow

This repo has a persistent knowledge graph at `graphify-out/`, built by the `graphify` skill over the whole monorepo (`graphify-out/.graphify_root` pins the root). It is the fastest way to answer architecture questions across `backend/` + `frontend/` without reading dozens of files.

**At the start of every session:** check the graph before exploring the codebase by hand.

```bash
ls graphify-out/graph.json          # confirm the graph exists
```

If it exists, treat any architecture/"how does X work"/"what calls Y"/"where is Z" question as a graphify query first, before grepping or reading files:

```bash
graphify query "<question>"
graphify path "<NodeA>" "<NodeB>"      # shortest path between two concepts
graphify explain "<Node>"              # plain-language explanation of one node
```

Also check whether the graph is **stale** before trusting it: compare `graphify-out/cost.json` (`runs[-1].date`) against recent commits / working-tree changes. A graph built before a rewrite will confidently describe code that no longer exists. If it's stale, rebuild before querying.

**After editing files:** refresh the graph so it never drifts from the code.

```bash
graphify . --code-only --update      # incremental — re-extracts only new/changed files
```

This is **automated by a hook**: `.claude/settings.json` registers a `PostToolUse` hook on `Write|Edit` that runs `.claude/hooks/graphify-update.sh` asynchronously after every file edit. The script no-ops for files outside this repo and for edits inside `graphify-out/`, and holds a lock so two refreshes never run at once. An incremental refresh takes ~1s. **Caveat:** the hook lives in *project* settings, so it only loads for sessions started inside `ConnectHub-monorepo/` — if you launch Claude Code from a parent directory, run the command manually.

Run it manually after finishing a set of edits (before wrapping up a task or reporting completion), not after every single keystroke — `--update` is incremental but still walks the tree, so batching per task keeps it cheap while keeping the graph honest. If files were **deleted or moved** in bulk (e.g. the Flutter→Angular rewrite), do a full `graphify . --code-only` instead so removed nodes are pruned, then `graphify cluster-only .` to regenerate `GRAPH_REPORT.md`.

`graphify-out/` is gitignored-adjacent working state, not source — do not hand-edit anything inside it; regenerate instead.

### Known limitation: doc nodes are stale

There is no LLM API key in this environment, so rebuilds run with `--code-only` (`graphify . --code-only`). Code nodes come from local AST parsing and are accurate. **Markdown/doc nodes are not re-extracted** — and because pruning is keyed on the file path, a doc that was *edited in place* keeps its old content in the graph forever. As of the 2026-07-21 rebuild this affects `frontend/CLAUDE.md` and `frontend/TODO.md`, whose graph nodes still describe the deleted Flutter app ("ConnectHub Flutter Claude Rules", "Bosqich 1: Shared Widgets…"). `GRAPH_REPORT.md`'s "Community Hubs" list is likewise stale in places (community names need `graphify label`, which also needs a key).

Practical rule: **trust the graph for code, read the file for docs.** If a query returns a doc-sourced node, open the actual file before relying on it.

## Running the stack locally

Postgres and Redis run via Homebrew (Docker Desktop is installed but its daemon is often not running):

```bash
brew services start postgresql@16 redis
minio server /opt/homebrew/var/minio --address :9000 --console-address :9001   # media, see below
cd backend && npm run start:dev       # http://localhost:4000/api/v1, Swagger at /api/docs
npx maildev                           # SMTP :1025 + web UI :1080 — REQUIRED, or /auth/register 500s
cd frontend && npx ng serve --port 5050
```

**MinIO runs via Homebrew, not Docker** (`brew install minio minio-mc`). `docker-compose.yml` still defines a `minio` service, but the Docker daemon is usually not running here, and a `docker system prune` wipes the volume — which is exactly how every previously-uploaded avatar/attachment was lost once. Default creds `minioadmin`/`minioadmin` match `backend/.env`. The bucket is **not** created automatically:

```bash
mc alias set localch http://localhost:9000 minioadmin minioadmin
mc mb localch/connecthub-media
mc anonymous set download localch/connecthub-media   # required: the frontend loads media by direct URL, not presigned
```

Without the `download` policy every `<img src="http://localhost:9000/...">` returns 403; without MinIO running at all, uploads fail at request time and media URLs already in the DB return `ERR_CONNECTION_REFUSED`.

**Web push needs VAPID keys in `backend/.env`** (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`). Without them `WebPushService` logs a warning at boot and silently no-ops — every other notification path keeps working, so a missing key looks like "push just doesn't fire". Generate a pair with `npx web-push generate-vapid-keys`. Two things to know when testing it: the `web-push` library always talks **HTTPS** to the subscription endpoint regardless of the URL's scheme, so a plain-HTTP test endpoint fails with an opaque `EPROTO` TLS error; and push requires a secure context in the browser, which `localhost` satisfies but a LAN IP does not.

**System clock must be NTP-synced.** TOTP 2FA (`speakeasy`, `window: 1` = ±30s) silently rejects every code if the host clock drifts — this machine was once 4 hours ahead and *all* 2FA logins failed with a generic "Kod noto'g'ri" 400 that looks like a code bug. Check with `sntp -t 3 time.apple.com`; the offset should be under a second. The same drift also writes future `createdAt` values, which breaks the cursor pagination in `messages` and `posts/:id/comments`.

The backend's `.env` points `MAIL_HOST`/`MAIL_PORT` at `localhost:1025`; with no SMTP catcher listening there, registration writes the user row and *then* throws `ECONNREFUSED`, returning 500 and leaving an unverified orphan user behind. Start MailDev before testing any auth email flow.

The dev database is `connecthub`, owned by the local `bek` role (not `postgres`) — `backend/.env` reflects this. `REDIS_PASSWORD` is empty because the Homebrew Redis has no `requirepass` set.
