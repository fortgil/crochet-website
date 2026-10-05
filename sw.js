// ===============================================
//  TWIZIE | ROSETTE CROCHET — SERVICE WORKER (PWA)
// ===============================================

const CACHE_NAME = 'twizie-crochet-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  './images/icon.svg',
  './images/BAG 1.jpg',
  './images/BAG 2.jpg',
  './images/BAG 3.jpg',
  './images/BAG 4.jpg',
  './images/BAG 5.jpg',
  './images/spiderman beanie.jpg',
  './images/cat ear beanie blue.jpg',
  './images/ruffle bonnet bucket hats.jpg',
  './images/yellow blossom ruffle bucket hat.jpg',
  './images/striped slouchy beanie.jpg',
  './images/cream bow keychain.jpg',
  './images/jellyfish keychain.jpg',
  './images/pastel tie headbands.jpg',
  './images/crochet headbands.jpg',
  './images/crochet scrunchies.jpg',
  './images/spiderweb hip drape.jpg',
  './images/pink ruffle hair bow.jpg'
];

// 1. INSTALL — Pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA] Pre-caching partial assets warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE — Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH — Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for HTML pages so updates are immediate
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first with network fallback for images, styles, scripts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Return nothing if offline and asset not cached
      });
    })
  );
});
