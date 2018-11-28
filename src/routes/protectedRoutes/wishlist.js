'use strict';

const Route = require('../../types/route');
const wishlistHandlers = require('../../handlers/wishlistHandlers');

const getUserWishlistSchema = {
  'GET /wishlists/user/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

const getWishlistsVisibleByUserSchema = {
  'GET /wishlists/:id': {
    properties: {
      id: {
        type: 'string'
      },
      group: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

const updateUserWishlistSchema = {
  'POST /wishlists/user/:id': {
    properties: {
      id: {
        type: 'string'
      },
      wishlist: {
        type: 'object'
      }
    },
    required: ['id', 'wishlist']
  }
};

const getUserClaimsFromWishlistSchema = {
  'GET /wishlists/claims/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

module.exports = [
  new Route('/wishlists', 'GET', null, null, wishlistHandlers.getWishlists),
  new Route(
    '/wishlists/user/:id',
    'GET',
    null,
    getUserWishlistSchema,
    wishlistHandlers.getUserWishlist
  ),
  new Route(
    '/wishlists/:id',
    'GET',
    null,
    getWishlistsVisibleByUserSchema,
    wishlistHandlers.getWishlistsVisibleByUser
  ),
  new Route(
    '/wishlists/user/:id',
    'POST',
    null,
    updateUserWishlistSchema,
    wishlistHandlers.updateUserWishlist
  ),
  new Route(
    '/wishlists/claims/:id',
    'GET',
    null,
    getUserClaimsFromWishlistSchema,
    wishlistHandlers.getUserClaims
  )
];
