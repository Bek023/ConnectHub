# Frontend (Flutter) — Bug va kamchiliklar tahlili (2026-07-02)

Kod tahlili natijasida topilgan muammolar. Eng xavflisi — backend bilan API kontrakt mos kelmasliklari: bular runtime'da to'g'ridan-to'g'ri crash yoki bo'sh ekran beradi.

## Kritik — backend bilan kontrakt mos emas

- [ ] **Chat xabarlari umuman yuklanmaydi** — `chat_repository.dart` `getMessages` javobdan `data['items']`ni o'qiydi, lekin backend `findByChat` oddiy massiv qaytaradi (`{ success, data: [...] }`) → cast xatosi. Yo frontendni massivga moslash, yo backendni `{items, ...}` pagination formatiga o'tkazish kerak
- [ ] **Chat pagination cursor noto'g'ri** — `chat_provider.dart` `build`/`loadMore` cursor sifatida `messages.last.id` (UUID) yuboradi, backend esa `createdAt` timestamp kutadi (`LessThan(new Date(cursor))`) → `new Date(uuid)` Invalid Date, loadMore hech narsa qaytarmaydi. `createdAt`ni yuborish kerak
- [ ] **Feed crash bo'ladi** — `post_model.dart` `PostModel.author` required obyekt, lekin backend `feed` faqat `authorId` qaytaradi (author relation yuklanmaydi); `likesCount`/`commentsCount` backendda `likeCount`/`commentCount` deb ataladi; `isLiked` feed javobida umuman yo'q → `fromJson` exception. Backend feed'ga author relation + per-user isLiked qo'shish yoki modelni moslash kerak
- [ ] **2FA login crash** — `auth_repository.dart` `verify2FA` javobdan `data['user']`ni o'qiydi, lekin backend `verifyTwoFaLogin` faqat `{accessToken, refreshToken, userId}` qaytaradi (user yo'q) → null cast crash
- [ ] **updateProfile 404** — `auth_repository.dart` `PATCH /users/me` yuboradi, backend esa faqat `PUT /users/me` qabul qiladi
- [ ] **Reaksiyalar UIda hech qachon ko'rinmaydi** — `chat_provider.dart` `_onReaction` `data['reactions']` (to'liq ro'yxat) kutadi, backend `messageReaction` eventida `{chatId, messageId, emoji, userId}` yuboradi → `reactions` doim null, state o'zgarmaydi

## Yuqori

- [ ] **Token refresh race** — `dio_client.dart`da mutex yo'q: bir vaqtda bir nechta 401 kelsa parallel `_tryRefresh` chaqiriladi; backend refresh tokenni rotate qilgani uchun ikkinchisi fail bo'ladi va tokenlar tozalanadi → user bekorga logout bo'ladi. Bitta shared Completer/lock kerak
- [ ] **Refresh fail bo'lsa user "o'lik" sessiyada qoladi** — interceptor `clearTokens()` qiladi, lekin `authProvider` state yangilanmaydi → router redirect ishlamaydi, UI login'ga qaytarmaydi. Auth notifier'ga signal (callback/stream) kerak
- [ ] **Socket eski token bilan reconnect bo'ladi** — `chat_socket_service.dart`/`call_socket_service.dart` connect paytidagi access tokenni handshake'ga muhrlaydi; 15 daqiqadan keyin socket.io auto-reconnect eski token bilan urinadi → server rad etadi va real-time butunlay o'chib qoladi. Reconnect oldidan yangi token o'rnatish kerak
- [ ] **Reconnect'dan keyin roomlar tiklanmaydi** — server qayta ulanganda `joinChat` qayta yuborilmaydi (faqat provider build'da bir marta) → reconnect'dan keyin xabarlar kelmaydi. `onReconnect`da aktiv chatlarga qayta join qilish kerak
- [ ] **Logout'da socketlar uzilmaydi** — `chatSocketServiceProvider`/`callSocketService` keepAlive, `Auth.logout()` ularni disconnect qilmaydi → keyingi login'da eski user sessiyasining sockets/streamlari aralashadi
- [ ] **Prod'da to'liq HTTP loglar** — `dio_client.dart` `_logEnabled = true` hardcoded const ("prod'da off" degan komment bilan, lekin off qilinmagan) — request/response bodylar, jumladan tokenlar, prod konsolga chiqadi. `kDebugMode`/flavor'ga bog'lash kerak
- [ ] **Offline'da auto-logout** — `auth_notifier.dart` `build`: `getMe()` har qanday xatoda (shu jumladan network xatoda) `clearTokens()` qiladi → internetsiz ochilganda mavjud sessiya o'chib ketadi. Faqat 401'da tozalash kerak

## O'rta

- [ ] `loadMore` state merge race — javob kutilayotganda socket orqali yangi xabar kelsa, `copyWith` eski `current` snapshot ustidan yoziladi va yangi xabar yo'qoladi; `state.valueOrNull`ni yozish paytida qayta o'qish kerak
- [ ] Xabar yuborishda optimistic UI va xato holati yo'q — `Chat.send()` faqat emit qiladi; server javob bermasa xabar UIda ko'rinmaydi va user xatodan bexabar qoladi (pending/failed status kerak)
- [ ] `feed_notifier.dart` `toggleLike`: `firstWhere` post topilmasa StateError otadi (refresh bilan race'da mumkin); `isLiked` boshlang'ich qiymati backenddan kelmagani uchun optimistic toggle noto'g'ri boshlanadi
- [ ] `secure_storage.dart` `hasSession` faqat access tokenni tekshiradi — access yo'q-u refresh bor holatda sessiya yo'q deb hisoblanadi
- [ ] Web'da tokenlar amalda localStorage'da (flutter_secure_storage web fallback) — XSS xavfi; hech bo'lmaganda hujjatlashtirish yoki httpOnly cookie flow'ni ko'rib chiqish
- [ ] `chat_socket_service.dart` `isConnected` faqat `_socket != null`ni tekshiradi — haqiqiy ulanish holatini (`socket.connected`) aks ettirmaydi
- [ ] `_onTyping` timer'lari userId bo'yicha — user yozishni tugatib xabar yuborsa ham 3 soniya "typing" ko'rinib turadi (newMessage kelganda typing'ni o'chirish kerak)
