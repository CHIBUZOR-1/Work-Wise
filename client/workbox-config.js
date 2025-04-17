export default {
  globDirectory: 'public/',
  globPatterns: ['**/*.{html,js,css,json,png,jpg,svg}'],
  swDest: 'public/servicWorker.js',
  runtimeCaching: [
    {
      urlPattern: /\.(?:css)$/, // Matches all CSS files
      handler: 'StaleWhileRevalidate', // Ensures latest CSS loads
      options: {
        cacheName: 'css-cache',
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 10,
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.yourdomain\.com\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
  ],
}
  