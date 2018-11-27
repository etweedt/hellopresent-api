'use strict';

const Router = require('koa-router');
const userHandlers = require('./handlers/userHandlers');
// const wishlistHandlers = require('./handlers/wishlistHandlers');

const ROUTER = new Router();

ROUTER.get('/users/:id', userHandlers.getUser);
// ROUTER.get('/user/wishlist/:id', userHandlers.getUserWishlist);
// ROUTER.get('/wishlists/:id', wishlistHandlers.getAllWishlists);

module.exports = ROUTER;
