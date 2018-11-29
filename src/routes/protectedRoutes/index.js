'use strict';

const user = require('./user');
const wishlist = require('./wishlist');
const group = require('./group');

module.exports = [].concat(user, wishlist, group);
