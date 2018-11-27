'use strict';

const Route = require('../../types/route');
const healthCheckHandlers = require('../../handlers/healthCheckHandlers');

module.exports = [
  new Route(
    '/healthCheck',
    'GET',
    null,
    null,
    healthCheckHandlers.healthCheckHandler
  )
];
