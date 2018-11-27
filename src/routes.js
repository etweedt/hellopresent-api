'use strict';

const Router = require('koa-router');
const wishlistHandlers = require('./handlers/wishlistHandlers');
const userHandlers = require('./handlers/userHandlers');

const ROUTER = new Router();

ROUTER.get('/user/wishlist/:id', userHandlers.getUserWishlist);
ROUTER.get('/wishlists/:id', wishlistHandlers.getAllWishlists);

module.exports = ROUTER;
