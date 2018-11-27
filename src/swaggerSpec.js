module.exports = {
  swagger: '2.0',
  info: {
    title: 'NodeJS Koa API',
    description: 'This is a NodeJS API, built with Koa',
    version: '1.0.0'
  },
  schemes: ['http'],
  paths: {
    '/healthcheck': {
      get: {
        summary: 'Returns obligatory health check status',
        tags: ['healthcheck']
      }
    }
  }
};
