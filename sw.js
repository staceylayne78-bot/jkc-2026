// Service worker: the shell (HTML + competitor data) is network-first so day-of corrections
// reach phones immediately; everything else is cache-first so the program keeps working on
// venue wifi / backstage dead zones. Bump VERSION on every deploy.
const VERSION = "jkc2026-v21";
const PRECACHE = [
  "./",
  "index.html",
  "data.js",
  "manifest.webmanifest",
  "assets/fonts/cinzel-latin.woff2",
  "assets/fonts/oswald-latin.woff2",
  "assets/logos/web/jkc-crest.png",
  "assets/logos/web/kings-advantage.png",
  "assets/logos/web/mammoth-nutrition.png",
  "assets/logos/web/gregs-muffins.svg",
  "assets/logos/web/viva-barista.png",
  "assets/logos/web/jack-kings-gym.png",
  "assets/logos/web/favicon-64.png",
  "assets/logos/web/ocb.png",
  "assets/logos/web/apple-touch-icon.png",
  "assets/about/Jack-King.jpg",
  "assets/about/Jerry-Martin.jpg",
  "assets/about/jack-kings-family.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;

  const freshFirst = e.request.mode === "navigate" || e.request.url.endsWith("data.js");
  if (freshFirst) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
