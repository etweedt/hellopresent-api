'use strict';

const user = require('./user');
const wishlist = require('./wishlist');
const group = require('./group');
const search = require('./search');
const notification = require('./notification');

module.exports = [].concat(user, wishlist, group, search, notification);
