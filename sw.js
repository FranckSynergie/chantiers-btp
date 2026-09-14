// Service Worker — Synergie BTP Recherche Chantier
// Stratégie : réseau d'abord (toujours la version la plus fraîche si
// connecté), avec le cache comme secours hors-ligne uniquement.

const CACHE_NAME = 'chantiers-btp-v20260914';
const URLS = [
  './',
  './index.html',
  './manifest.json',
  './chantiers.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
