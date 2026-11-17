

const CACHE_NAME = "smartmove-v4";

// Archivos principales de SmartMove
const FILES_TO_CACHE = [
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg",
        "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// INSTALAR SERVICE WORKER
self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();

});

// ACTIVAR Y LIMPIAR CACHES ANTERIORES
self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then((keys) => {

            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );

        }).then(() => {
            return self.clients.claim();
        })
    );

});

// RESPONDER A LAS SOLICITUDES
self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // No interceptar mapas ni servicios externos
    if (url.origin !== self.location.origin) return;

    event.respondWith(

        fetch(event.request)

            .then((response) => {

                if (response.ok) {

                    const copy = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, copy);
                    });

                }

                return response;

            })

            .catch(async () => {

                const cached = await caches.match(event.request);

                if (cached) return cached;

                // Página principal cuando no hay conexión
                return caches.match("./index.html");

            })

    );

});
