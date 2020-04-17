const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./styles.css",
    "./dist/assets/icons/icon_96x96.994a94bb78c999a2f9c0f26de63dc12d.png",
    "./dist/assets/icons/icon_128x128.d0093ac41d530797b049a6e954619b02.png",
    "./dist/assets/icons/icon_192x192.7bcd6caee51150523b1902b37499b0cd.png",
    "./dist/assets/icons/icon_256x256.7fed1e84821de9559f5dda2f61c72c1d.png",
    "./dist/assets/icons/icon_384x384.4974b5bbeb02c60c3f6f678cba2b3d6d.png",
    "./dist/assets/icons/icon_512x512.2359d8c5512984950d88b5dd9631999c.png",
    "./dist/bundle.js"
  ];
  
  
  const PRECACHE = "precache-v1";
  const RUNTIME = "runtime";
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });
  
  self.addEventListener("fetch", event => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  