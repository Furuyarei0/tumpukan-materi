// Service Worker untuk Notifikasi Web Push - Tumpukan Materi
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {
    title: "Tumpukan Materi",
    body: "Ada kiriman materi baru yang menunggu persetujuan.",
    url: "/#admin/inbox",
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = {
        title: data.title || payload.title,
        body: data.body || payload.body,
        url: data.url || payload.url,
      };
    } catch {
      const text = event.data.text();
      if (text) {
        payload.body = text;
      }
    }
  }

  const options = {
    body: payload.body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    data: {
      url: payload.url,
      timestamp: Date.now(),
    },
    vibrate: [100, 50, 100],
    tag: "tumpukan-submission-notify",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetPath = event.notification.data?.url || "/#admin/inbox";
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Jika ada tab yang sudah terbuka di URL yang sama, bawa ke depan
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Jika belum ada, buka jendela baru
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return null;
    }),
  );
});
