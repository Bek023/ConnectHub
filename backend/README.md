# ConnectHub

ConnectHub — NestJS + PostgreSQL + Redis asosidagi backend ilova.

## Texnik Stack
- NestJS 10, TypeScript, PostgreSQL 16, Redis 7, TypeORM
- Socket.io (real-vaqt chat), mediasoup (WebRTC qo'ng'iroqlar)
- Elasticsearch (qidiruv), S3/MinIO (media saqlash)

## Texnik zadaniya
To'liq texnik zadaniya va code review: `ConnectHub — Backend (NestJS) TZ ....md`

## Boshlash tartibi (MVP → Production)
1. Foundation — Auth, Users, JWT Guards
2. Core Chat — Groups, Messages, Socket.io Gateway
3. Media — Upload, S3/MinIO
4. Content — Posts, Channels, Notifications
5. Search — Elasticsearch (yoki PostgreSQL FTS)
6. Calls — mediasoup, WebRTC
