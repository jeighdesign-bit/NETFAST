const CACHE_NAME = 'netfast-pwa-v4';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/logo.png',
  '/navbar-logo.png',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
];

// Install SW and cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate SW and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch interception and caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip caching for non-GET requests (e.g. POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // 2. Skip caching and bypass SW completely for video players, stream providers, API routes, external images, etc.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/image') || // Bypass Next.js optimized images
    url.hostname.includes('tmdb.org') ||       // Bypass TMDB images
    url.hostname.includes('unsplash.com') ||   // Bypass Unsplash images
    url.host.includes('api.codespecters.com') ||
    url.host.includes('vidsrc') ||
    url.host.includes('embed.su') ||
    url.host.includes('smashy') ||
    url.host.includes('vidlink') ||
    url.host.includes('multiembed.mov') ||
    url.host.includes('vercel-insights.com') ||
    url.host.includes('vercel-analytics') ||
    request.headers.get('range') // Skip range requests to prevent video playback failure
  ) {
    return; // Let the browser handle it natively without SW interference
  }

  // 3. Static assets caching (Cache-First strategy)
  // Cache JS/CSS chunks, fonts, and LOCAL static public assets only.
  // IMPORTANT: Do NOT intercept external image URLs (e.g. TMDB images) here —
  // returning a local favicon fallback for failed external images causes the
  // hero banner to display the Netfast logo instead of a proper backdrop.
  const isLocalOrigin = url.origin === self.location.origin;
  const isStaticAsset =
    url.pathname.includes('/_next/static/') ||
    url.pathname.includes('/fonts/') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    STATIC_ASSETS.includes(url.pathname);
  const isLocalImage = isLocalOrigin && (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp')
  );

  if (isStaticAsset || isLocalImage) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch updated version in the background (stale-while-revalidate)
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // For local images only, return a minimal transparent 1x1 PNG
          // instead of a branded logo to avoid showing wrong content
          if (request.destination === 'image') {
            return caches.match('/favicon-32x32.png');
          }
        });
      })
    );
    return;
  }

  // 4. Page Navigations and other requests (Network-First, fallback to cache)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && !url.pathname.startsWith('/_next/image')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback offline experience
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
