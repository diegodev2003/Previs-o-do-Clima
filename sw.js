// Service worker: guarda a "casca" do app para abrir offline. A API do clima nunca é cacheada aqui.
const CACHE = 'prev-clima-v3';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './src/css/main.css', './src/css/reset.css', './src/css/variables.css', './src/css/header.css',
  './src/css/modaAlert.css', './src/css/weatherCard.css',
  './src/js/main.js', './src/js/mapDom/dom.js', './src/js/services/callApi.js', './src/js/services/storage.js',
  './src/js/components/modalAlert.js', './src/js/components/soundOk.js',
  './src/js/config/configApi.js', './src/js/config/configModalAlert.js',
  './src/js/tasks/render.js', './src/js/tasks/format.js',
  './src/sound/notification.mp3', './src/img/icon-192.png', './src/img/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // stale-while-revalidate: abre rápido do cache e atualiza em segundo plano
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
