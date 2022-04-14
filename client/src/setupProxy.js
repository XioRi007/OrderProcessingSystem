const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/orders',
    createProxyMiddleware({
      target: process.env.SERVER || 'http://localhost:5000/',
      changeOrigin: true,
    })
  );
};