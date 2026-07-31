// Self-unregistering service worker.
// Replaces the old Workbox SW that cached the start-url with a stale version
// containing :3000 port references. This SW unregisters itself and clears
// all caches so browsers fetch fresh content.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches
      if ("caches" in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // Unregister this service worker
      await self.registration.unregister();
      // Tell all clients to reload
      const clients = await self.clients.claim();
      const allClients = await self.clients.matchAll({ type: "window" });
      allClients.forEach((client) => client.navigate(client.url));
    })()
  );
});