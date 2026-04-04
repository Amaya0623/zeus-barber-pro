const CACHE_NAME = 'zeus-barber-v2';

// 1. INSTALACIÓN DEL MOTOR Y GUARDADO EN CACHÉ
self.addEventListener('install', e => {
  console.log('[Zeus SW] Instalado como App Web PWA 🚀');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

// 2. INTERCEPTOR (Permite abrir la app incluso sin internet)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then(res => {
        return res || caches.match('/index.html');
      });
    })
  );
});
