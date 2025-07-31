const CACHE_NAME = 'vendinha-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png',
  // Imagens dos produtos
  'assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png',
  'assets/6.png', 'assets/7.png', 'assets/8.png', 'assets/9.png', 'assets/10.png',
  'assets/11.png', 'assets/12.png', 'assets/13.png', 'assets/14.png', 'assets/15.png',
  'assets/16.png', 'assets/17.png', 'assets/18.png', 'assets/19.png', 'assets/20.png',
  'assets/21.png', 'assets/22.png', 'assets/23.png', 'assets/24.png', 'assets/25.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});