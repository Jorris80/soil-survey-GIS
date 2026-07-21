/* Service Worker — Database Soil Survey & GIS Sync
 * VERSI di bawah DISTEMPEL OTOMATIS oleh GitHub Actions saat commit
 * (lihat .github/workflows/deploy.yml). Tidak perlu ubah manual. */
var VERSI = "__VERSI__";

var INTI = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(INTI).catch(function(){}); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request, url = req.url;
  if (req.method === "POST" || url.indexOf("script.google.com") !== -1 || url.indexOf("googleusercontent.com") !== -1 || url.indexOf("cdnjs.cloudflare.com") !== -1 || url.indexOf("unpkg.com") !== -1 || url.indexOf("api.anthropic.com") !== -1) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (r) {
      var cp = r.clone(); caches.open(VERSI).then(function (c) { c.put("./index.html", cp); }); return r;
    }).catch(function () { return caches.match("./index.html").then(function (r) { return r || caches.match("./"); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (cached) {
    if (cached) return cached;
    return fetch(req).then(function (r) {
      if (r && (r.status === 200 || r.type === "opaque")) { var cp = r.clone(); caches.open(VERSI).then(function (c) { c.put(req, cp); }); }
      return r;
    }).catch(function () { return cached; });
  }));
});
