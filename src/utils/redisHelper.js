'use strict';

const redis = require('redis');
const {promisify} = require('util');
const config = require('../config');

const client = redis.createClient({
  url: config.redis.endpoint
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', redis.print);

const set = promisify(client.set).bind(client);
const get = promisify(client.get).bind(client);
const del = promisify(client.del).bind(client);

module.exports = {
  set: (key, value) => {
    // 2 hour cache
    set(key, value, 'EX', 7200);
  },
  get,
  del
};
