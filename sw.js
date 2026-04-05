const CACHE_NAME = 'zeus-barber-v2';

// 1. INSTALACIÓN Y TOMA DE CONTROL INMEDIATA
self.addEventListener('install', e => {
  self.skipWaiting(); // 🚀 MAGIA: Fuerza al motor a encenderse sin esperar
  console.log('[Zeus SW] Instalado como App Web PWA 🚀');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

// 2. ACTIVACIÓN INMEDIATA EN EL NAVEGADOR
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim()); // 🚀 MAGIA: Toma el control de la pantalla de una vez
});

// 3. INTERCEPTOR OFFLINE
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then(res => {
        return res || caches.match('/index.html');
      });
    })
  );
});
