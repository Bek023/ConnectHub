# ConnectHub

Maqsadlar asosida odamlarni birlashtiruvchi ijtimoiy platforma — backend va frontend bitta monorepo ichida.

## Tuzilma

```
ConnectHub-monorepo/
├── backend/    NestJS + PostgreSQL + Redis API
└── frontend/   Flutter (Web + Mobile) ilova
```

## Backend (`backend/`)

- NestJS 10, TypeScript, PostgreSQL 16, Redis 7, TypeORM
- Socket.io (real-vaqt chat), mediasoup (WebRTC qo'ng'iroqlar)
- Elasticsearch (qidiruv), S3/MinIO (media saqlash)

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Batafsil: [`backend/README.md`](backend/README.md), [`backend/API_DOCS.md`](backend/API_DOCS.md)

## Frontend (`frontend/`)

- Flutter 3.22+, Riverpod (state management), Web + Mobile qo'llab-quvvatlash

```bash
cd frontend
flutter pub get
flutter run
```

Batafsil: [`frontend/README.md`](frontend/README.md), [`frontend/API_DOCS.md`](frontend/API_DOCS.md)

## Ikkalasini birga Docker'da ishga tushirish

Root'dagi `docker-compose.yml` backend (NestJS API + Postgres + Redis + Elasticsearch + MinIO) va frontend (Flutter web build, nginx orqali) hammasini birga ko'taradi.

```bash
cp backend/.env.example backend/.env   # agar hali yo'q bo'lsa, qiymatlarni to'ldiring
docker compose --env-file backend/.env up --build
```

- API: http://localhost:4000
- Frontend (web): http://localhost:8080
- Frontend build vaqtida backend manzilini o'zgartirish uchun: `FRONTEND_API_URL` va `FRONTEND_WS_URL` env o'zgaruvchilarini o'rnating.

## Repository

https://github.com/Bek023/ConnectHub
