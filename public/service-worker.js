if (workbox) {
  console.log(`Workbox is loaded`);

  workbox.skipWaiting();

  workbox.setConfig({
    debug: false,
  });

  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    new RegExp('https://cnx-go-home(.+)surge.sh|localhost'),
    workbox.strategies.networkFirst({
      cacheName: 'api',
    }),
  );

  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'googleapis',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 30,
        }),
      ],
    }),
  );
}
else {
  console.log(`Workbox didn't load`);
}