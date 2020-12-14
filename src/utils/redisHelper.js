'use strict';

const cache = {};

function set(key, value, timeout) {
  console.log(`Setting cache for key: ${key}`);
  cache[key] = value;

  setTimeout(() => {
    delete cache[key];
  }, timeout * 1000);
}

function get(key) {
  console.log(`Getting cache value for key: ${key}`);
  return cache[key];
}

function del(key) {
  console.log(`Deleting value for key: ${key}`)
  delete cache[key];
}

module.exports = {
  set: (key, value) => {
    set(key, value, 7200);
  },
  get,
  del
};
