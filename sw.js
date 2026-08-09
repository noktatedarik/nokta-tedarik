var SURUM = 'v3-premium';
self.addEventListener('install', function () {
  caches.keys().then(function (anahtarlar) {
    return Promise.all(anahtarlar.map(function (k) { return caches.delete(k); }));
  });
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (url.indexOf('github.io') === -1 && url.indexOf('localhost') === -1 && url.indexOf('file:') !== 0) return;
  e.respondWith(
    fetch(e.request).then(function (yanit) {
      var klon = yanit.clone();
      caches.open(SURUM).then(function (c) { c.put(e.request, klon); }).catch(function () { });
      return yanit;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (liste) {
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].url.indexOf('sofor') > -1) { return liste[i].focus(); }
    }
    return clients.openWindow('sofor');
  }));
});
