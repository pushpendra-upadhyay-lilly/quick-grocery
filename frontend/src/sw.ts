/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Workbox precaching — vite-plugin-pwa injects the manifest here
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// SPA fallback: all navigation requests return index.html
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

// Runtime caching: API products (NetworkFirst, 5 min TTL)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/products'),
  new NetworkFirst({
    cacheName: 'api-products',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 300 })],
  }),
);

// Runtime caching: images (CacheFirst, 24h TTL, max 200 entries)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 86400 }),
    ],
  }),
);

// ── Push notification handler ──────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const payload = event.data.json() as {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: { orderId?: string; status?: string; url?: string };
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      silent: false,
      body: payload.body,
      icon: payload.icon ?? '/icons/icon-192.png',
      badge: payload.badge ?? '/icons/icon-192.png',
      data: payload.data,
      tag: `order-${payload.data?.orderId ?? 'update'}`,
      renotify: true,
      actions: [
        { action: 'view', title: 'View Order' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    } as NotificationOptions),
  );
});

// ── Notification click handler ─────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url: string = (event.notification.data as { url?: string })?.url ?? '/orders';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) {
            (client as WindowClient).focus();
            (client as WindowClient).navigate(url);
            return;
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
