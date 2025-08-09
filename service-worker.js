// Define un nombre para la caché y la versión.
// Cambiar la versión forzará al service worker a actualizarse y a buscar nuevos archivos.
const CACHE_NAME = 'west-coast-trip-v1';

// Lista de los archivos que se guardarán en la caché.
// Esto incluye los archivos principales de la app y las librerías externas.
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/@phosphor-icons/web',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://i0.wp.com/vetturinos.com/wp-content/uploads/2024/11/San-Francisco-con-el-Puente-Golden-Gate.jpg?resize=1200%2C500&ssl=1',
  'https://placehold.co/192x192/3b82f6/ffffff?text=🏜️',
  'https://placehold.co/512x512/3b82f6/ffffff?text=🏜️'
];

// Evento 'install': Se dispara cuando el service worker se instala por primera vez.
self.addEventListener('install', event => {
  // Espera a que la promesa de instalación se resuelva.
  event.waitUntil(
    // Abre la caché con el nombre que hemos definido.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        // Añade todos los archivos de nuestra lista a la caché.
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la página realiza una petición de red (p. ej., para un archivo, una imagen, etc.).
self.addEventListener('fetch', event => {
  event.respondWith(
    // Comprueba si la petición ya existe en la caché.
    caches.match(event.request)
      .then(response => {
        // Si la respuesta está en la caché, la devuelve.
        if (response) {
          return response;
        }
        // Si no está en la caché, realiza la petición a la red.
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Se dispara cuando el service worker se activa.
// Se utiliza para limpiar cachés antiguas si hemos actualizado la versión.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Borra las cachés que no coincidan con la versión actual.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
