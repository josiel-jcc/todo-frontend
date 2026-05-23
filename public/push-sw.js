/* Web Push handlers — imported by the Workbox-generated service worker */

self.addEventListener('push', (event) => {
  let payload = { title: 'Lembrete de tarefa', body: '', url: '/' };

  try {
    if (event.data) {
      const json = event.data.json();
      payload = {
        title: json.title || payload.title,
        body: json.body || '',
        url: json.url || '/',
      };
    }
  } catch {
    // use defaults
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: { url: payload.url },
      icon: '/icons/icon-192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
