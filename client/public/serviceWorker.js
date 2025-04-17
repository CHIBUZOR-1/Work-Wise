const CACHE_NAME = 'v1-static-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/logo.png',
];

// ✅ Service Worker Installation (Caching Assets)
self.addEventListener('install', event => {
  console.log('✅ Service Worker Installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('⏳ Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ✅ Activate Event (Clears Old Caches)
self.addEventListener('activate', event => {
  console.log('✅ Service Worker Activated');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`🗑 Removing old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// ✅ Fetch Event (Serve Cached Content or Fetch New)
self.addEventListener('fetch', event => {
  console.log(`🌐 Fetch request: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
