# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ConnectHub frontend: an Angular 22 standalone-component web app consuming the NestJS backend at `../backend` (contract documented in `backend/API_DOCS.md`). This is a from-scratch rewrite replacing an earlier Flutter frontend — there is no Figma/design doc to follow; UI is built directly against the backend's REST/WebSocket contract. The app is built in phases mirroring the backend's own build order (see `backend/TODO.md`): Phase 1 (current) is project scaffold + full Auth flow + navigable app shell with placeholder routes for every other feature.

## Commands

```bash
npm install                  # install deps
npm start                    # ng serve — dev server on the CLI default port; project has been run manually with `ng serve --port 5050` to avoid clashing with macOS AirPlay on port 5000
npm run build                # ng build (production config by default)
npm run watch                # ng build --watch --configuration development
npm test                     # ng test (vitest-based unit-test builder, *.spec.ts)
```

There is no linter configured yet (no ESLint/Prettier check script beyond the `.prettierrc` formatting config) — don't assume `npm run lint` exists.

The backend must be running locally for the app to do anything beyond render static screens: `cd ../backend && npm run start:dev` (needs Postgres+Redis; see `backend/CLAUDE.md`). For the auth email flows (register verification, password reset) to work end-to-end, a local SMTP catcher must also be running — this project has been tested against `npx maildev` (SMTP `:1025`, web UI `http://localhost:1080`) since the backend's `.env` points `MAIL_HOST`/`MAIL_PORT` there in development.

## Architecture

**API base URL** is hardcoded in `src/environments/environment.ts` (`apiUrl: 'http://localhost:4000/api/v1'`) — there is only one environment file so far (no prod `environment.prod.ts` / `fileReplacements` wired in `angular.json` yet; add that when a real deployment target exists).

**Response envelope.** Every backend response is `{success:true,data}` or `{success:false,statusCode,message}`. `src/app/core/services/api/api-envelope.ts` exposes `apiGet`/`apiPost`/`apiPut`/`apiDelete` wrapper functions that unwrap `.data` (or throw the `.message`) so feature/service code always deals in plain typed payloads, never the envelope itself. Use these wrappers for any new endpoint rather than calling `HttpClient` directly.

**Auth flow and token handling** (`src/app/core/services/auth/auth.service.ts`): access token lives only in memory (`TokenStorage`, `src/app/core/services/token-storage/token-storage.ts`); refresh token + userId persist in `localStorage`. `AuthService.refreshAccessToken()` dedupes concurrent 401s behind a single in-flight `Observable` (`shareReplay(1)` + a `refreshInFlight$` field cleared via `finalize`) — this mirrors the pattern already established in the developer's other Angular projects (`faceid-korxona`), so keep that shape if you touch it. `src/app/core/interceptors/auth-interceptor.ts` is a functional `HttpInterceptorFn`: attaches `Authorization: Bearer <token>` to any request under `environment.apiUrl` except the URLs listed in `AUTH_SKIP_URLS` (`src/app/core/services/api/api-endpoints.ts`), and on a 401 triggers `refreshAccessToken()` + retries the original request once, redirecting to `/welcome` on refresh failure. `src/app/core/guards/auth-guard.ts` exports both `authGuard` (requires a session) and `guestGuard` (redirects an already-authenticated user away from `/welcome`, `/login`, etc.) as functional `CanActivateFn`s — routes are protected in `app.routes.ts`, not in components.

**Login can branch into 2FA.** `POST /auth/login` returns either a full session or `{requires2FA:true, twoFaToken}` — `isLoginRequires2FA()` in `src/app/features/auth/models/auth.model.ts` is the type guard used to route between `/feed` and `/two-fa`. Data needed by the next screen (`userId` after register, `twoFaToken` after a 2FA-gated login, `email` into reset-password) is passed via Angular Router navigation `state` and read back with `history.state` in the destination component's field initializer — there's no shared "pending auth" service, by design, to keep this stateless between page loads.

**Routing** (`src/app/app.routes.ts`): flat list of lazy `loadComponent` routes for the public auth pages, plus one `authGuard`-protected parent route (`path: ''`) that lazy-loads `AppShell` (`src/app/shared/layouts/app-shell/app-shell.ts` — sidebar/topbar chrome) and nests every real feature (`feed`, `goals`, `groups`, `channels`, `chat`, `calls`, `notifications`, `profile`, `settings`) as children. All of those children currently point at the same reusable `ComingSoon` placeholder component (`src/app/shared/components/coming-soon/coming-soon.ts`) — when building out a feature, replace its route's `loadComponent` target rather than restructuring the route tree.

**Styling** is Tailwind CSS v3 (`tailwind.config.js`, `postcss.config.js`, `darkMode: 'class'`), no Angular Material, no SCSS — matches the developer's established convention on their other Angular projects. Components use inline Tailwind utility classes in the `template:` string rather than separate `.html`/`.css` files, except the root `App` component which still uses `templateUrl`/`styleUrl` from the CLI scaffold.

The accent scale is `accent-*` (emerald). It is deliberately **not** indigo/violet: the taste skill bans the "AI purple" default (its `THE LILA RULE`). Neutrals are `zinc-*`. Repeated UI patterns live as `@layer components` classes in `src/styles.css` (`.field-input`, `.field-label`, `.field-error`, `.btn-primary`, `.btn-secondary`, `.btn-ghost-icon`, `.link-accent`) — each already carries its `dark:` half, so using them is the cheapest way to satisfy the dual-theme rule. Verified contrast (WCAG AA, both themes): primary button 5.48 light / 7.84 dark, body copy ≥ 7.4 in both.

**Theme and language** are root services: `ThemeService` (`core/services/theme/`) toggles the `dark` class on `<html>`, persists to localStorage, falls back to `prefers-color-scheme`. `LanguageService` (`core/services/language/`) wraps `@ngx-translate/core`, supports uz/ru/en, persists the choice and mirrors it onto `<html lang>`. Both are initialised in `provideAppInitializer` in `app.config.ts`. Translation JSON lives in `public/i18n/{uz,ru,en}.json` and is served from `/i18n/` — add a key to **all three** files at once.

**The routed `<main>` carries `.route-stack`** (defined in `src/styles.css`: `display: grid; align-items: start` with every child pinned to `grid-column: 1; grid-row: 1`). During a route transition Angular keeps the leaving and entering components in the DOM at the same time; in normal flow they stack **vertically**, so the page grows and then snaps back when the leaving one is destroyed — a visible jump on every navigation. Putting them in one grid cell overlaps them instead, keeping `scrollHeight` constant. Do not "fix" this with `position: absolute` on `:enter`/`:leave` — absolutely positioned children resolve against the padding box, which throws away `<main>`'s `p-5` and reintroduces a shift.

**Animations** live in `shared/animations/route-animations.ts` (`routeTransition` for the shell's `<router-outlet>`, `listStagger` for nav items). `provideAnimations()` is registered in `app.config.ts`. The shell binds `[@routeTransition]="routeKey()"`, where `routeKey()` reads the active child route's path from `ChildrenOutletContexts` — the bound value must change per route or the trigger will not fire. Note that Angular animates via the Web Animations API, so animated elements get **no inline `style` attribute**; verify with `document.getAnimations()`, not a MutationObserver on styles.

**Every component that renders block-level layout declares `host: { class: 'block' }`.** An Angular component host element defaults to `display: inline`, and vertical margins do not apply to inline boxes — so a component dropped into a `space-y-*` parent silently gets **zero** spacing while its plain `<section>` siblings space correctly. This is invisible in the template and cost a real bug in Settings (the Change-password and 2FA cards sat flush against their neighbours). Flex/grid children are exempt in practice, since flex blockifies them. When extracting a section into its own component, add the host class in the same edit.

**Current user state.** `AuthService.currentUser` is a signal and is the single source of truth for who is logged in. It is populated on app start by `provideAppInitializer` (which calls `fetchMe()` when `TokenStorage.hasSession()`), on login, and after any mutation that changes the user (profile save, 2FA toggle) via `setCurrentUser()`. **Derive from it with `computed()`, never snapshot it into a plain `signal()` in a field initializer** — on a cold page load the initializer runs before `fetchMe()` resolves, so a snapshot is silently wrong (this caused Settings to show 2FA as disabled after every refresh).

**Media/avatar upload** goes through `MediaService.upload(file, 'image')` → `POST /media/upload` (multipart, `file` + `type`). The backend converts images to `.webp`, generates a thumbnail, stores both in S3/MinIO and returns `{url, key}`; that `url` is then saved onto the user via `PUT /users/me {avatarUrl}`. **This needs MinIO running** (`S3_ENDPOINT=http://localhost:9000`): `docker run -d --name connecthub-minio -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin minio/minio server /data --console-address ':9001'`, then create the `connecthub-media` bucket and set it to public download. Without it, upload fails at request time.

**Password change signs the user out.** `POST /auth/change-password` nulls the user's `refreshToken` server-side, so the session dies at the next refresh. `ChangePasswordSection` therefore logs out and redirects to `/login` on success rather than leaving a session that will fail later.

**Membership state is computed client-side.** No list endpoint returns whether the current user has joined a goal, is a member of a group, or is subscribed to a channel — the backend entities simply have no such field. Each list/detail page therefore also fetches the corresponding `/my` endpoint and builds a `Set<string>` of ids to derive the badge and the join/leave button state. Don't add an `isJoined`-style field to the frontend models pretending it comes from the API; if the backend gains one, delete the extra `/my` call instead.

**Goal → Group/Channel hierarchy.** A group and a channel each belong to exactly one goal (`goalId`, required by both create DTOs), so the create forms load the goal list into a `<select>` and block submission until one is chosen. Creating a group makes the creator an `admin` member with `memberCount: 1`; creating a channel does **not** auto-subscribe the creator (`subscriberCount` stays 0) — don't assume symmetry between the two.

**Models mirror backend DTOs field-for-field** (`src/app/features/auth/models/auth.model.ts`) — when adding a new feature's models, read the corresponding section of `backend/API_DOCS.md` first rather than guessing field names/casing; the backend uses camelCase consistently but pagination shape is *not* consistent across modules (some endpoints are page-based `{items,total,page,limit,totalPages}`, others are cursor-based bare arrays) — check the specific endpoint before assuming a shape.

## Project rules (non-negotiable)

These are standing rules for this frontend. They are not suggestions — apply them while writing the feature, not as a cleanup pass afterwards.

**1. No emoji, no device/system icons — ever.** Not as UI icons, not as decoration, not in placeholder screens, not in `template:` strings. Use a real icon library:
- `@fortawesome/angular-fontawesome` (fa-icons), or
- `@hugeicons/angular` + `@hugeicons/core-free-icons` (huge-icons)

Pick one per component tree and stay consistent. An emoji standing in for an icon counts as a violation even in throwaway placeholder UI.

**2. Build i18n in as you go.** Any user-visible string goes through the translation layer at the moment the component is written — never hardcode a label "for now" and plan to extract it later. The app targets uz / ru / en (the deleted Flutter app carried `app_uz.arb` / `app_ru.arb` / `app_en.arb`; the Angular equivalent must cover the same three). If the i18n mechanism isn't wired yet, wiring it is part of the first task that needs a string, not a separate future phase.

**3. Use the taste skill for any UI work.** Before drawing or restyling a screen, invoke the `design-taste-frontend` skill (installed under `.agents/skills/`, the current default taste skill; `design-taste-frontend-v1` is the legacy variant). This applies to new screens, redesigns, and any change where visual output is the point. Don't freehand a layout and hope it looks right.

**4. Animate the UI.** Page/route transitions are required, not optional — plus meaningful micro-interactions (hover, press, loading, list enter/leave, state changes). Route transitions go through Angular's animation system so navigation never hard-cuts.

**5. Both themes, always, at the same time.** Every screen is built for light *and* dark in the same pass — never dark-only "for now". Tailwind is configured with `darkMode: 'class'`, so every color decision needs its `dark:` counterpart as it's written. A screen that only looks right in one theme is unfinished.

Also inherited from the user's global rules: **no comments in code** and no emoji anywhere in source.

## Conventions carried over from the developer's other Angular projects

100% standalone components (no `NgModule`s), `inject()` for DI instead of constructor injection, Angular Signals for local/UI state (`signal()`/`computed()`) combined with RxJS `Observable`s for HTTP and cross-cutting auth state (no NgRx), functional interceptors/guards, kebab-case file and folder names, feature-first structure (`core/` infra + `shared/` reusable UI + `features/<name>/pages|models`).

## Realtime (chat)

`ChatSocketService` (`core/services/socket/`) owns the single socket.io connection to the `/chat` namespace. Three things there are load-bearing and easy to break:

1. **The handshake token expires.** Access tokens live 15 minutes and only in memory. The service refreshes `socket.auth.token` on `reconnect_attempt`; without that, every reconnect after the first 15 minutes is rejected and realtime silently dies.
2. **Rooms do not survive a reconnect.** socket.io restores the connection, not the `joinChat` rooms. The service keeps a `joinedChats` set and re-emits `joinChat` for each on every `connect`.
3. **Logout must tear the socket down.** `AuthService.registerSessionTeardown()` lets the socket service hook `clearSession()`; otherwise the next login reuses a socket still authenticated as the previous user.

`joinChat` is membership-checked server-side (`isMemberAnyType`), so a chat room only opens for groups/channels the user actually belongs to — the chat list is therefore built from `groups/my` + `channels/my`. Message history is REST (`GET /messages/:chatType/:chatId`), cursor-paginated on an **ISO timestamp** (not an id) and returned newest-first, so the room reverses each page before prepending it.

**Emoji exception:** `message-bubble.ts` holds `QUICK_REACTIONS = ['👍','❤️','😂','🎉']`. This is the one place emoji are allowed, because the backend's reaction API stores an emoji string (`reactToMessage {emoji}`, `message_reactions.emoji`) — they are the feature's data, not decoration. The no-emoji rule still applies everywhere else.
