const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// INSTALL SW
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("CACHE_NAME")
            .then((cache) => {
                console.log("Opened cache");

                return cache.addAll(urlsToCache);
            })
    );
});

// LISTEN FOR REQUESTS
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match("offline.html"))
            })
    );
});

// ACTIVATE THE SW
self.addEventListener("activate", function(event) {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );

});
