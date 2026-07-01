// ConnectHub — PWA Service Worker
// Joylashuv: web/flutter_service_worker.js ni customize qilish uchun
// yoki web/sw.js sifatida qo'shing va index.html dan ro'yxatdan o'tkizing.

const CACHE_NAME = 'connecthub-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/main.dart.js',
  '/flutter.js',
  '/manifest.json',
  '/icons/Icon-192.png',
  '/icons/Icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

// FCM Push — firebase-messaging-sw.js bilan birlashtirish uchun
// web/firebase-messaging-sw.js faylini alohida yarating:
//
// importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-messaging-compat.js');
// firebase.initializeApp({ ... });
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//   self.registration.showNotification(
//     payload.notification.title,
//     { body: payload.notification.body, icon: '/icons/Icon-192.png' }
//   );
// });
