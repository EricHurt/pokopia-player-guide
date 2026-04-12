/**
 * Replaces legacy Workbox `sw.js` from @vite-pwa/astro. That worker precached `/404`
 * (HTTP 404 on Vercel) and broke installs. This script clears caches and unregisters
 * so the site runs with no service worker. Safe to delete this file and its * registration in BaseLayout once stranded clients are gone.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (_) {
        /* ignore */
      }
      const clients = await self.clients.matchAll({ type: 'window' });
      await self.registration.unregister();
      clients.forEach((client) => {
        try {
          client.navigate(client.url);
        } catch (_) {
          /* ignore */
        }
      });
    })(),
  );
});
