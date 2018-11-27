'use strict';

const config = require('../config');
const jwt = require('koa-jwt');
const {koaJwtSecret} = require('jwks-rsa');

const setup = () => {
  const jwtOptions = {
    secret: koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`
    }),
    audience: `${config.auth0.audience}`,
    issuer: `${config.auth0.issuer}`,
    algorithms: config.auth0.algorithms,
    tokenKey: 'authToken',
    passthrough: false
  };

  return jwt(jwtOptions);
};

module.exports = {setup};
