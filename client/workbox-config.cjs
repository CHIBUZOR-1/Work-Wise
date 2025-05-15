// workbox-config.js
const path = require('path');

module.exports = {
  globDirectory: 'dist/',  // This tells Workbox where to look for files to cache
  globPatterns: [
    '**/*.{html,js,css,json,png,jpg,svg,webp}' // File types to cache
  ],
  swDest: path.resolve(__dirname, 'dist/serviceWorker.js'),  // Path to output the service worker
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'css-cache',
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
        },
      },
    },
    {
      urlPattern: /^https:\/\/work-wise-u6cm\.onrender\.com\/api\//,  // Your API URL for prod dev
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
  ],
};
