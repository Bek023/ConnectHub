# ConnectHub — Backend API Hujjati

> Flutter frontend uchun. Base URL: `http://localhost:4000/api/v1`  
> Swagger UI: `http://localhost:4000/api/docs`

---

## Umumiy

### Response format

Barcha javoblar bir xil formatda:

```json
// Muvaffaqiyatli
{ "success": true, "data": { ... } }

// Xato
{ "success": false, "statusCode": 401, "message": "Xato matni" }

// Validatsiya xatosi
{ "success": false, "statusCode": 400, "message": ["email noto'g'ri", "parol qisqa"] }
```

### Authentication

Himoyalangan endpointlarga `Authorization` header qo'shiladi:

```
Authorization: Bearer <accessToken>
```

Access token muddati: **15 daqiqa**. Muddati tugagach `refreshTokens` orqali yangilanadi.

### Pagination

Sahifalash qo'llab-quvvatlaydigan endpointlar:

```
GET /posts/feed?page=1&limit=20
```

Response:
```json
{ "items": [...], "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
```

---

## 1. Auth

### Ro'yxatdan o'tish

```
POST /auth/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Pass1234!",
  "displayName": "John Doe"
}
```

**Response:**
```json
{ "success": true, "data": { "message": "Tasdiqlash kodi emailga yuborildi", "userId": "uuid" } }
```

> Parol qoidasi: kamida 8 ta belgi, katta harf, kichik harf, raqam yoki belgi.

---

### Email tasdiqlash

```
POST /auth/verify-email
```

**Body:**
```json
{ "userId": "uuid", "code": "123456" }
```

**Response:**
```json
{ "success": true, "data": { "message": "Email tasdiqlandi" } }
```

---

### Tasdiqlash kodini qayta yuborish

```
POST /auth/resend-verification
```

**Body:**
```json
{ "userId": "uuid" }
```

> 60 soniya cooldown bor. Bir daqiqada max 3 marta.

---

### Kirish

```
POST /auth/login
```

**Body:**
```json
{ "email": "john@example.com", "password": "Pass1234!" }
```

**Response (odatiy):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "userId": "uuid",
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "avatarUrl": null,
      "bio": null,
      "isVerified": true,
      "isActive": true,
      "twoFaEnabled": false,
      "createdAt": "2026-06-26T..."
    }
  }
}
```

**Response (2FA yoqilgan bo'lsa):**
```json
{ "success": true, "data": { "requires2FA": true, "twoFaToken": "uuid" } }
```

> 5 marta noto'g'ri parol → 15 daqiqa bloklash.

---

### 2FA bilan login yakunlash

```
POST /auth/2fa/verify-login
```

**Body:**
```json
{ "twoFaToken": "uuid", "totpCode": "123456" }
```

**Response:** Odatiy login response'i (accessToken, refreshToken, user).

---

### Tokenni yangilash

```
POST /auth/refresh
```

**Body:**
```json
{ "userId": "uuid", "refreshToken": "eyJ..." }
```

**Response:**
```json
{ "success": true, "data": { "accessToken": "eyJ...", "refreshToken": "eyJ...", "userId": "uuid" } }
```

---

### Chiqish

```
POST /auth/logout
Authorization: Bearer <accessToken>
```

> Access token darhol blacklist qilinadi (15 daqiqa kutish shart emas).

---

### Joriy foydalanuvchi

```
GET /auth/me
Authorization: Bearer <accessToken>
```

---

### Parolni o'zgartirish

```
POST /auth/change-password
Authorization: Bearer <accessToken>
```

**Body:**
```json
{ "currentPassword": "OldPass1!", "newPassword": "NewPass1!" }
```

---

### Parolni unutdim

```
POST /auth/forgot-password
```

**Body:**
```json
{ "email": "john@example.com" }
```

> Email mavjud bo'lmasa ham bir xil javob qaytaradi (xavfsizlik uchun).

---

### Parolni tiklash

```
POST /auth/reset-password
```

**Body:**
```json
{ "email": "john@example.com", "code": "123456", "newPassword": "NewPass1!" }
```

---

### 2FA sozlash

```
POST /auth/2fa/setup
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "BASE32SECRET",
    "qrCodeUrl": "data:image/png;base64,..."
  }
}
```

> `qrCodeUrl` ni `Image.memory(base64Decode(...))` bilan ko'rsatish mumkin.

---

### 2FA yoqish

```
POST /auth/2fa/enable
Authorization: Bearer <accessToken>
```

**Body:**
```json
{ "secret": "BASE32SECRET", "totpCode": "123456" }
```

---

### 2FA o'chirish

```
POST /auth/2fa/disable
Authorization: Bearer <accessToken>
```

**Body:**
```json
{ "totpCode": "123456" }
```

---

## 2. Users

Barcha endpointlar `Authorization` talab qiladi.

### Profil ko'rish

```
GET /users/me
```

### Profil yangilash

```
PUT /users/me
```

**Body:**
```json
{
  "displayName": "Yangi Ism",
  "bio": "Men haqimda...",
  "avatarUrl": "https://cdn.example.com/avatar.jpg"
}
```

> Avatar URL ni oldin `/media/upload` orqali yuklab, qaytgan URL ni bu yerga yozing.

### Akkauntni o'chirish (soft delete)

```
DELETE /users/me
```

### Foydalanuvchi qidirish

```
GET /users/search?q=john&page=1&limit=20
```

### Boshqa foydalanuvchi profili

```
GET /users/:id
```

---

## 3. Posts

Barcha endpointlar `Authorization` talab qiladi.

### Feed

```
GET /posts/feed?page=1&limit=20
```

### Post yaratish

```
POST /posts
```

**Body:**
```json
{
  "chatType": "group",
  "chatId": "uuid",
  "content": "Post matni",
  "mediaUrls": ["https://cdn.example.com/image.jpg"]
}
```

> `chatType`: `"group"` yoki `"channel"`

### Post ko'rish

```
GET /posts/:id
```

### Post tahrirlash

```
PUT /posts/:id
```

**Body:** `{ "content": "Yangi matn" }`

### Post o'chirish

```
DELETE /posts/:id
```

### Like / Unlike

```
POST /posts/:id/like
DELETE /posts/:id/like
```

### Like tekshirish

```
GET /posts/:id/liked
```

**Response:** `{ "success": true, "data": { "liked": true } }`

### Kommentlar

```
GET /posts/:id/comments?cursor=<lastCommentId>
```

```
POST /posts/:id/comments
```

**Body:** `{ "content": "Komment", "replyTo": "optionalCommentId" }`

```
DELETE /posts/:id/comments/:commentId
```

### Pin / Unpin

```
POST /posts/:id/pin
DELETE /posts/:id/pin
```

---

## 4. Messages (REST)

Barcha endpointlar `Authorization` talab qiladi.

### Chat tarixini olish

```
GET /messages/:chatType/:chatId?cursor=<lastMessageId>&limit=30
```

> `chatType`: `"group"` yoki `"direct"`  
> Cursor-based pagination — oxirgi xabar ID sini yuborasiz.

### Xabarni tahrirlash

```
PUT /messages/:id
```

**Body:** `{ "content": "Yangi matn" }`

### Xabarni o'chirish

```
DELETE /messages/:id
```

### Reaksiya qo'shish / olib tashlash (toggle)

```
POST /messages/:id/react
```

**Body:** `{ "emoji": "👍" }`

### Kim o'qigani

```
GET /messages/:id/read-by
```

---

## 5. Messages (WebSocket)

### Ulanish

```
Namespace: /chat
```

```dart
final socket = io('http://localhost:4000/chat', OptionBuilder()
  .setTransports(['websocket'])
  .setAuth({'token': accessToken})
  .build());
```

### Eventlar (client → server)

| Event | Ma'lumot | Tavsif |
|---|---|---|
| `joinChat` | `{ chatId }` | Chat xonasiga kirish |
| `leaveChat` | `{ chatId }` | Chat xonasidan chiqish |
| `sendMessage` | `{ chatType, chatId, content, type?, mediaUrl? }` | Xabar yuborish (20/min limit) |
| `typing` | `{ chatId }` | Yozayapti ko'rsatkichi |
| `reactToMessage` | `{ messageId, emoji }` | Reaksiya |
| `markRead` | `{ messageId }` | O'qildi belgisi |

> `type` qiymatlari: `"text"`, `"image"`, `"video"`, `"voice"`, `"file"`

### Eventlar (server → client)

| Event | Ma'lumot | Tavsif |
|---|---|---|
| `newMessage` | Message obyekti | Yangi xabar keldi |
| `userTyping` | `{ userId, chatId }` | Kimdir yozmoqda |
| `messageReaction` | Reaction ma'lumoti | Reaksiya o'zgardi |

---

## 6. Groups

### Guruhlar ro'yxati (public)

```
GET /groups?goalId=uuid&page=1&limit=20
```

### Guruh ko'rish (public)

```
GET /groups/:id
```

### Guruh yaratish 🔒

```
POST /groups
```

**Body:**
```json
{
  "goalId": "uuid",
  "name": "Guruh nomi",
  "description": "Tavsif",
  "isPrivate": false
}
```

### Guruhni yangilash 🔒

```
PUT /groups/:id
```

### Guruhni o'chirish 🔒

```
DELETE /groups/:id
```

### Guruhga qo'shilish 🔒

```
POST /groups/:id/join
```

### Invite kod orqali qo'shilish 🔒

```
POST /groups/join/:code
```

### Guruhdan chiqish 🔒

```
DELETE /groups/:id/leave
```

### A'zolar ro'yxati 🔒

```
GET /groups/:id/members?page=1&limit=50
```

### A'zo rolini o'zgartirish 🔒

```
PUT /groups/:id/members/:userId
```

**Body:** `{ "role": "admin" }` — `role`: `"member"` | `"admin"` | `"owner"`

### A'zoni chiqarish 🔒

```
DELETE /groups/:id/members/:userId
```

---

## 7. Channels

### Kanallar ro'yxati (public)

```
GET /channels?goalId=uuid&page=1&limit=20
```

### Kanal ko'rish (public)

```
GET /channels/:id
```

### Kanal yaratish 🔒

```
POST /channels
```

**Body:** `{ "goalId": "uuid", "name": "Kanal nomi", "description": "...", "isPrivate": false }`

### Kanalga obuna bo'lish 🔒

```
POST /channels/:id/subscribe
DELETE /channels/:id/unsubscribe
```

### Obunachillar 🔒

```
GET /channels/:id/subscribers?page=1
```

### Statistika 🔒

```
GET /channels/:id/stats
```

---

## 8. Goals

### Maqsadlar ro'yxati (public)

```
GET /goals?page=1&limit=20&category=sport&q=yugurish
```

### Trend maqsadlar (public)

```
GET /goals/trending
```

### Mening maqsadlarim 🔒

```
GET /goals/my
```

### Maqsad ko'rish (public)

```
GET /goals/:id
```

### Maqsad yaratish 🔒

```
POST /goals
```

**Body:**
```json
{
  "title": "Kuniga 5 km yugurish",
  "description": "Tavsif",
  "category": "sport",
  "targetDate": "2026-12-31"
}
```

### Maqsadga qo'shilish / chiqish 🔒

```
POST /goals/:id/join
DELETE /goals/:id/leave
```

---

## 9. Calls (REST)

Barcha endpointlar `Authorization` talab qiladi.

### Qo'ng'iroq boshlash

```
POST /calls/initiate
```

**Body:** `{ "chatId": "uuid", "type": "video" }` — `type`: `"audio"` | `"video"`

### Qo'ng'iroqqa qo'shilish

```
POST /calls/:id/join
```

### Chiqish

```
DELETE /calls/:id/leave
```

### Qo'ng'iroqni tugatish

```
POST /calls/:id/end
```

### Ishtirokchilar

```
GET /calls/:id/participants
```

### Tarix

```
GET /calls/history?page=1
```

---

## 10. Calls (WebSocket — mediasoup SFU)

### Ulanish

```
Namespace: /calls
```

```dart
final socket = io('http://localhost:4000/calls', OptionBuilder()
  .setTransports(['websocket'])
  .setAuth({'token': accessToken})
  .build());
```

### Signaling oqimi

```
1. REST: POST /calls/initiate → callId olish
2. WS:  joinCallRoom      → { rtpCapabilities, producers }
3. WS:  createTransport   → send transport yaratish
4. WS:  connectTransport  → DTLS握手
5. WS:  produce           → audio/video stream boshlash
6. WS:  getProducers      → boshqalar stream'larini olish
7. WS:  consume           → boshqa stream'ga subscribe
8. WS:  resumeConsumer    → consume boshlash
```

### Eventlar (client → server)

| Event | Ma'lumot | Tavsif |
|---|---|---|
| `joinCallRoom` | `{ callId }` | Xonaga kirish |
| `leaveCallRoom` | `{ callId }` | Xonadan chiqish |
| `createTransport` | `{ callId, direction: "send"\|"recv" }` | Transport yaratish |
| `connectTransport` | `{ transportId, dtlsParameters }` | Transport ulash |
| `produce` | `{ callId, transportId, kind, rtpParameters }` | Stream boshlash |
| `getProducers` | `{ callId }` | Boshqalar stream'lari |
| `consume` | `{ callId, producerId, rtpCapabilities }` | Stream olish |
| `resumeConsumer` | `{ consumerId }` | Consume faollashtirish |
| `endCall` | `{ callId }` | Qo'ng'iroqni tugatish |

### Eventlar (server → client)

| Event | Ma'lumot | Tavsif |
|---|---|---|
| `userJoinedCall` | `{ userId }` | Yangi ishtirokchi |
| `userLeftCall` | `{ userId }` | Ishtirokchi chiqdi |
| `newProducer` | `{ producerId, userId, kind }` | Yangi stream |
| `callEnded` | `{ callId }` | Qo'ng'iroq tugadi |

---

## 11. Notifications (REST)

Barcha endpointlar `Authorization` talab qiladi.

### Bildirishnomalar ro'yxati

```
GET /notifications?page=1&unreadOnly=true
```

### Hammasini o'qildi qilish

```
PUT /notifications/read-all
```

### Bitta o'qildi

```
PUT /notifications/:id/read
```

### O'chirish

```
DELETE /notifications/:id
```

### Push token ro'yxatdan o'tkazish

```
POST /notifications/push/register
```

**Body:**
```json
{ "token": "FCM_TOKEN", "platform": "android" }
```

> `platform`: `"ios"` | `"android"` | `"web"`

---

## 12. Notifications (WebSocket)

### Ulanish

```
Namespace: /notifications
```

```dart
final socket = io('http://localhost:4000/notifications', OptionBuilder()
  .setTransports(['websocket'])
  .setAuth({'token': accessToken})
  .build());
```

### Eventlar (server → client)

| Event | Ma'lumot | Tavsif |
|---|---|---|
| `notification` | Notification obyekti | Yangi bildirishnoma |
| `newMessage` | Message preview | Yangi xabar (fon) |

---

## 13. Search

### Qidirish (public)

```
GET /search?q=flutter&type=all
```

> `type`: `"all"` | `"goals"` | `"groups"` | `"messages"`

**Response (`type=all`):**
```json
{
  "success": true,
  "data": {
    "goals": [...],
    "groups": [...],
    "messages": [...]
  }
}
```

### Tavsiyalar (public)

```
GET /search/suggestions?q=yu
```

> Top 5 goal qaytaradi (autocomplete uchun).

---

## 14. Media

Barcha endpointlar `Authorization` talab qiladi.

### Fayl yuklash

```
POST /media/upload
Content-Type: multipart/form-data
```

**Form fields:**

| Field | Tur | Tavsif |
|---|---|---|
| `file` | binary | Fayl |
| `type` | string | `image` \| `video` \| `voice` \| `file` |

**Response (rasm):**
```json
{ "success": true, "data": { "url": "https://cdn.../image.jpg", "key": "images/uuid.jpg" } }
```

**Response (video — async):**
```json
{ "success": true, "data": { "url": "https://cdn.../video.mp4", "key": "videos/uuid.mp4", "processingJobId": "job-id" } }
```

> Video thumbnail async yaratiladi. `processingJobId` ni kuzatib borish mumkin.

**Ruxsat etilgan format va hajm:**

| Tur | Formatlar | Max hajm |
|---|---|---|
| image | jpg, png, gif, webp | 10 MB |
| video | mp4, mov, avi | 100 MB |
| voice | mp3, wav, ogg, m4a | 10 MB |
| file | * (istalgan) | 100 MB |

### Fayl o'chirish

```
DELETE /media/:key
```

> `key` — upload javobidagi `key` qiymati.

### Presigned URL olish

```
GET /media/presigned/:key?expires=3600
```

> Private fayllar uchun vaqtinchalik URL olish. `expires` — soniyalarda (standart: 3600).

---

## 15. Health

```
GET /health
```

**Response:**
```json
{ "success": true, "data": { "status": "ok", "timestamp": "2026-06-26T..." } }
```

---

## Flutter uchun eslatmalar

### Token saqlash
```dart
// flutter_secure_storage ishlatish tavsiya etiladi
final storage = FlutterSecureStorage();
await storage.write(key: 'accessToken', value: response.data.accessToken);
await storage.write(key: 'refreshToken', value: response.data.refreshToken);
```

### Auto refresh interceptor (dio)
```dart
dio.interceptors.add(InterceptorsWrapper(
  onError: (error, handler) async {
    if (error.response?.statusCode == 401) {
      final newTokens = await authService.refresh();
      error.requestOptions.headers['Authorization'] = 'Bearer ${newTokens.accessToken}';
      return handler.resolve(await dio.fetch(error.requestOptions));
    }
    return handler.next(error);
  },
));
```

### WebSocket ulanish pattern
```dart
// socket_io_client package ishlatiladi
Socket socket = io(
  'http://localhost:4000/chat',
  OptionBuilder()
    .setTransports(['websocket'])
    .disableAutoConnect()
    .setAuth({'token': accessToken})
    .build(),
);

socket.onConnect((_) => print('Ulandi'));
socket.on('newMessage', (data) => handleNewMessage(data));
socket.connect();
```

### Xato handling
```dart
try {
  final response = await dio.post('/auth/login', data: {...});
  // response.data['success'] == true
  final user = response.data['data']['user'];
} on DioException catch (e) {
  // e.response?.data['message'] — xato matni yoki array
  final message = e.response?.data['message'];
  if (message is List) {
    showErrors(message.cast<String>());
  } else {
    showError(message ?? 'Xato yuz berdi');
  }
}
```

---

## Environment

`.env` da `ALLOWED_ORIGINS` ga frontend portini qo'shing:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:4200
```

Development rejimda barcha `localhost` portlar avtomatik ruxsat etiladi.
