'use strict';

const user = require('./user');
const wishlist = require('./wishlist');

module.exports = [].concat(user, wishlist);
