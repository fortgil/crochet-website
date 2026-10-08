// ===============================================
//  TWIZIE | ROSETTE CROCHET — SEO-FRIENDLY SERVICE WORKER
// ===============================================

const CACHE_NAME = 'twizie-crochet-v2-seo';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  './images/icon.svg'
];

// Install - lightweight caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA] Pre-caching warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - ALLOW SEARCH ENGINE CRAWLERS
self.addEventListener('fetch', (event) => {
  // Skip service worker for search engine crawlers
  const userAgent = event.request.headers.get('user-agent') || '';
  if (userAgent.includes('Googlebot') || 
      userAgent.includes('bingbot') || 
      userAgent.includes('Slurp') ||
      userAgent.includes('DuckDuckBot') ||
      userAgent.includes('Baiduspider') ||
      userAgent.includes('facebookexternalhit')) {
    // Let crawlers access content directly - no service worker interference
    return;
  }

  // Only handle GET requests for regular users
  if (event.request.method !== 'GET') return;

  // Network-first for HTML pages (SEO-friendly)
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./')))
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then((response) => {
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      });
    })
  );
});
