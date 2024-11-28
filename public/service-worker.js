if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.setConfig({ debug: false });
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([
        
    ]);

    /* custom cache rules */
    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: 'PRODUCTION',
        })
      )
    );

    // Adding staleWhileRevalidate for all js files. Provide faster access from cache while revalidating in the background
    workbox.routing.registerRoute(
      /.*\.js$/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all html files
    workbox.routing.registerRoute(
      /.*\.html/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all css files
    workbox.routing.registerRoute(
      /.*\.css/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding networkFirst for all json data. In offline mode will be fetched from cache
    // workbox.routing.registerRoute(
    //   new RegExp('https://data\\.data\\.org/.*\\.json'),
    //   new workbox.strategies.NetworkFirst(),
    //   'GET'
    // );

    // Cache S3 images
    // workbox.routing.registerRoute(
    //   /^https:\/\/cci-prod-0801\.s3\.ap-southeast-1\.amazonaws\.com\/upload\/images\/.*/,
    //   new workbox.strategies.CacheFirst({
    //     cacheName: 'image-cache-s3',
    //     plugins: [
    //       new workbox.expiration.ExpirationPlugin({
    //         maxEntries: 50, 
    //         maxAgeSeconds: 30 * 24 * 60 * 60, 
    //       }),
    //     ],
    //   })
    // );

    // Cache Images
    workbox.routing.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp|svg)$/, 
      new workbox.strategies.CacheFirst({
        cacheName: 'project-image-cache',
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxEntries: 50, 
            maxAgeSeconds: 30 * 24 * 60 * 60, 
          }),
        ],
      })
    );

    // Cache Apis
    // workbox.routing.registerRoute(({url}) => {
    //   const isCallAPI = url.toString().startsWith("https://api.cryptocopyinvest.com/api")
    //   if(isCallAPI) {
    //     // console.log("APIS_", url)
    //   }
    //   return isCallAPI
    //   // return new RegExp('https://api.cryptocopyinvest.com/api.*')
    // },
    // new workbox.strategies.StaleWhileRevalidate({
    //   cacheName: 'api-cache',
    // })
    //   // new workbox.strategies.NetworkFirst({
    //   //   cacheName: 'api-cache',
    //   // })
    // );

    workbox.routing.registerRoute(({url}) => {
        const isCallAPI = url.toString().startsWith("https://cci-prod-0801.s3.ap-southeast-1.amazonaws.com/upload/images")
        if(isCallAPI) {
          // console.log("APIS_", url)
        }
        return isCallAPI
        // return new RegExp('https://api.cryptocopyinvest.com/api.*')
      },
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 's3-cache',
      }));

  } else {
    console.log('Workbox could not be loaded. Hence, no offline support.');
  }
}
