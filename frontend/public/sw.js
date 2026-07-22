self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'ConnectHub', body: event.data.text(), data: {} };
  }

  const data = payload.data || {};
  let url = '/notifications';
  if (data.postId) {
    url = `/posts/${data.postId}`;
  } else if (data.chatId && data.chatType) {
    url = `/chat/${data.chatType}/${data.chatId}`;
  } else if (data.callId) {
    url = `/calls/${data.callId}`;
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'ConnectHub', {
      body: payload.body || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.id,
      data: { url },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url;
  if (!target) {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
