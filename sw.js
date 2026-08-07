// Service Worker — Synergie BTP Recherche Chantier
// Version : 2026-08-06 (CH001407 — 802 chantiers)
// Redeploy trigger: 2026-08-07 (relance suite incident GitHub Actions/Pages)

const CACHE_NAME = 'chantiers-btp-v20260806';
const URLS = [
  './',
  './index.html',
  './manifest.json'
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
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
