// ===============================================
//  TWIZIE | ROSETTE CROCHET — LIVE SERVICE WORKER (v3)
// ===============================================

const CACHE_NAME = 'twizie-crochet-v3-live';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  './images/icon.svg'
];

// Install - cache initial shell and immediately activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA] Pre-caching warning:', err);
      });
    })
  );
});

// Activate - instantly delete old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[PWA] Purging old cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network-first for code (HTML, JS, CSS) so updates appear instantly without Ctrl+F5!
self.addEventListener('fetch', (event) => {
  // Skip service worker for search engine crawlers
  const userAgent = event.request.headers.get('user-agent') || '';
  if (userAgent.includes('Googlebot') || 
      userAgent.includes('bingbot') || 
      userAgent.includes('Slurp') ||
      userAgent.includes('DuckDuckBot') ||
      userAgent.includes('Baiduspider') ||
      userAgent.includes('facebookexternalhit')) {
    return;
  }

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for HTML pages, JS files, and CSS stylesheets
  const isCodeOrDocument = 
    event.request.mode === 'navigate' || 
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css');

  if (isCodeOrDocument) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // If network is offline, load from cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') return caches.match('./');
            return null;
          });
        })
    );
    return;
  }

  // Cache-First for static media (images, svg, fonts) to save bandwidth and load fast
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      });
    })
  );
});
