'use strict';

const user = require('./user');
const wishlist = require('./wishlist');
const group = require('./group');
const search = require('./search');

module.exports = [].concat(user, wishlist, group, search);
