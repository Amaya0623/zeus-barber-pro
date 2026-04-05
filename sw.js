const CACHE_NAME = 'zeus-barber-v3'; // Subimos de versión para forzar actualización

// Archivos críticos para que la app funcione al 100% OFFLINE
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icono.png',
  // Agrega aquí los enlaces de las librerías externas que usas (Tailwind, SweetAlert, etc.) si es posible.
  // Ejemplo: 'https://cdn.tailwindcss.com',
  // 'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  console.log('[Zeus SW] Instalando Motor Offline Total 🛡️');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Zeus SW] Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // 1. Si está en caché, lo servimos de una vez (RÁPIDO Y OFFLINE)
      if (response) return response;

      // 2. Si no, intentamos buscarlo en la red
      return fetch(e.request).then(networkResponse => {
        // Si la respuesta es buena, la guardamos en caché para la próxima
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // Si falla la red y no está en caché (emergencia)
      if (e.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
