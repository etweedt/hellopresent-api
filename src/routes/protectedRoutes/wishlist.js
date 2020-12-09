'use strict';

const Route = require('../../types/route');
const wishlistHandlers = require('../../handlers/wishlistHandlers');

const getUserWishlistSchema = {
  'GET /wishlists/user/:email': {
    properties: {
      email: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const getWishlistsVisibleByUserSchema = {
  'GET /wishlists/:email': {
    properties: {
      email: {
        type: 'string'
      },
      group: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const updateUserWishlistSchema = {
  'POST /wishlists/user/:email': {
    properties: {
      email: {
        type: 'string'
      },
      wishlist: {
        type: 'object'
      },
      message: {
        type: 'string'
      }
    },
    required: ['email', 'wishlist']
  }
};

const getUserClaimsFromWishlistSchema = {
  'GET /wishlists/claims/:email': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const claimItemSchema = {
  'POST /wishlists/items/claim': {
    properties: {
      userId: {
        type: 'string'
      },
      wishlistId: {
        type: 'string'
      },
      itemId: {
        type: 'string'
      }
    },
    required: ['userId', 'wishlistId', 'itemId']
  }
};

const unclaimItemSchema = {
  'POST /wishlists/items/unclaim': {
    properties: {
      userId: {
        type: 'string'
      },
      wishlistId: {
        type: 'string'
      },
      itemId: {
        type: 'string'
      }
    },
    required: ['userId', 'wishlistId', 'itemId']
  }
};

module.exports = [
  new Route('/wishlists', 'GET', null, null, wishlistHandlers.getWishlists),
  new Route(
    '/wishlists/user/:email',
    'GET',
    null,
    getUserWishlistSchema,
    wishlistHandlers.getUserWishlist
  ),
  new Route(
    '/wishlists/:email',
    'GET',
    null,
    getWishlistsVisibleByUserSchema,
    wishlistHandlers.getWishlistsVisibleByUser
  ),
  new Route(
    '/wishlists/user/:email',
    'POST',
    null,
    updateUserWishlistSchema,
    wishlistHandlers.updateUserWishlist
  ),
  new Route(
    '/wishlists/claims/:email',
    'GET',
    null,
    getUserClaimsFromWishlistSchema,
    wishlistHandlers.getUserClaims
  ),
  new Route(
    '/wishlists/items/claim',
    'POST',
    null,
    claimItemSchema,
    wishlistHandlers.claimItem
  ),
  new Route(
    '/wishlists/items/unclaim',
    'POST',
    null,
    unclaimItemSchema,
    wishlistHandlers.unclaimItem
  )
];
