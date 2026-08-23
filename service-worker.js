// Название кэша (обновляйте при изменении файлов)
const CACHE_NAME = 'english-words-v1';

// Список файлов, которые нужно сохранить для офлайн-работы
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Установка Service Worker — кэшируем файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация — удаляем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов — возвращаем из кэша, если есть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если ресурс найден в кэше, возвращаем его
        if (response) {
          return response;
        }
        // Иначе делаем запрос в сеть
        return fetch(event.request);
      })
  );
});