// SW version
const CACHE = 'static-1.0';

// static cache - App Shell
const appAssets = [
	'./index.html',
	'./css/style.css',
    './js/bundle.js',
    // 'https://fonts.googleapis.com/css?family=Lato:300,400,700',
	'./img/movie_me_logo.png',
	'./img/TMDB_logo.png',
	'./img/icons/favicon.ico',
	'./img/icons/facebook.svg',
	'./img/icons/globe.svg',
	'./img/icons/instagram.svg',
	'./img/icons/search.svg',
	'./img/icons/star.svg',
	'./img/icons/star-imdb.svg',
	'./img/icons/twitter.svg',
];

// SW install
self.addEventListener('install', event => {
	console.log('SW INSTALLED')
	// add assets to cache
	event.waitUntil(
		caches.open(CACHE).then(cache => cache.addAll(appAssets))
	)
})

// SW Activate
self.addEventListener('activate', event => {
	console.log('SW ACTIVATED')

	// clean cache
	const cacheCleaned = (
		caches.keys()
		.then(keys => {
			keys.forEach(key => {
				if (key !== CACHE && key.includes('static')) return caches.delete(key);
			})
        })
        .catch(console.error)
	);

	event.waitUntil(cacheCleaned)
})

// Cache with Network Fallback
const staticCache = (req, cacheName = CACHE) => {
	return (
		caches.match(req)
		.then(cacheRes => {
			// return cache response if found
			if (cacheRes) return cacheRes;

			// else fallback to network
			return (
				fetch(req)
				.then(networkRes => {
					// update cache with new response
					caches.open(cacheName)
                    .then(cache => cache.put(req, networkRes))
                    .catch(console.error)

					// return clone of cache response
					return networkRes.clone();
                })
                .catch(console.error)
			)
        })
        .catch(console.error)
	)
}

// Network with Cache Fallback
const fallbackCache = req => {
	// Try Network
	return (
		fetch(req)
		.then(networkRes => {
			// if we dont get proper response, we just mimic the network failure
			// so that catch statement is run right away
            if (!networkRes.ok) throw 'Fetch Error';
            
            // cleanMediaCache();

			// update cache
			caches.open(CACHE)
            .then(cache => cache.put(req, networkRes))

			// return clone of response
			return networkRes.clone();
		})
		.catch(() => caches.match(req))     // if network fails, we just try the cache
	)
}

// delete old media files
const cleanMediaCache = media => {
    caches.keys().then(keys => {
        keys.forEach(key => {
            if (key === `media`) return caches.delete(key);
        })
    })
    .catch(console.error)
}

// SW Fetch
self.addEventListener('fetch', event => {
	console.log('SW FETCHED')

	// App Shell
	if (event.request.url.match(location.origin)) {
		event.respondWith(staticCache(event.request));
	}

	// API requests
	if (event.request.url.includes('api.themoviedb.org/3/') || event.request.url.includes('omdbapi.com/?i=')) {
		event.respondWith(fallbackCache(event.request))
	}

	// media have specific requests
    if (event.request.url.match('image.tmdb.org/t/p/')) {
		event.respondWith(staticCache(event.request, 'media'))
	}
})

// Listen for message from client
self.addEventListener('message', event => {
	// identify the message
	if (event.data.action === 'cleanMediaCache') cleanMediaCache();
})