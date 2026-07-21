# ConnectHub — Frontend (Angular)

ConnectHub — Angular 22 (standalone components) asosidagi web ilova. Backend (NestJS) bilan `backend/API_DOCS.md`da hujjatlashtirilgan REST/WebSocket kontrakti orqali ishlaydi.

## Texnik stack

- Angular 22, standalone components, funksional interceptor/guard, `inject()`
- Signals (lokal holat) + RxJS (HTTP, auth holati) — NgRx yo'q
- Tailwind CSS v3 (Material'siz, SCSS'siz)

## Ishga tushirish

Backend va MailDev (email tasdiqlash uchun) avval ishga tushirilgan bo'lishi kerak:

```bash
cd ../backend && npm run start:dev   # localhost:4000
npx maildev                          # SMTP :1025, web UI :1080
```

Frontend:

```bash
npm install
npm start          # ng serve (odatdagi 5000-portda AirPlay bilan to'qnashishi mumkin — ng serve --port 5050 ishlatilgan)
```

API manzili `src/environments/environment.ts`da (`apiUrl: 'http://localhost:4000/api/v1'`).

## Loyiha holati

Qolgan bosqichlar uchun `TODO.md`ga qarang — hozircha faqat Auth (register/login/2FA/parolni tiklash) va navigatsiya skeleti ishlaydi, qolgan feature'lar "Tez kunda" placeholder'lar bilan almashtirilgan.
