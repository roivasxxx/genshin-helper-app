// public/sw.js

const CACHE_NAME = "cloudinary-images-cache";

// Install the service worker
self.addEventListener("install", (event) => {
    console.log("Service worker installing...");
    self.skipWaiting();
});

// Activate the service worker
self.addEventListener("activate", (event) => {
    console.log("Service worker activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event handler
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Check if the request is for an image from Cloudinary
    if (url.pathname.startsWith("/_next/image")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});
