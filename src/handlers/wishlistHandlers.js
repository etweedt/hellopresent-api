'use strict';

const wishlistRepo = require('../repositories/wishlistRepo');
const userRepo = require('../repositories/userRepo');
const {stripMetadata} = require('../utils/cosmosHelper');
const Wishlist = require('../models/wishlist');
const WishlistItem = require('../models/wishlistItem');
const Exception = require('../types/exception');
const notificationHelper = require('../utils/notificationHelper');

const getWishlists = async () => {
  const wishlists = await wishlistRepo.get();
  stripMetadata(wishlists, false);

  return wishlists;
};

const getWishlistsVisibleByUser = async request => {
  const wishlists = await wishlistRepo.getForUser(request.vparams.email);
  stripMetadata(wishlists, false);

  return {wishlists};
};

const getUserWishlist = async request => {
  let wishlist = (await wishlistRepo.getForUser(request.vparams.email))[0];

  if (!wishlist) {
    wishlist = await wishlistRepo.create(new Wishlist(request.vparams.email));
  }

  stripMetadata(wishlist, false);

  return {wishlist};
};

const updateUserWishlist = async request => {
  const wishlist = (await wishlistRepo.getForUser(request.vparams.email))[0];
  wishlist.items = request.vparams.wishlist.items;

  const updated = await wishlistRepo.update(wishlist);

  notificationHelper.updatedWishlist(
    request.vparams.email,
    request.vparams.message ? request.vparams.message : null
  );

  stripMetadata(updated, false);

  return {wishlist: updated};
};

const getUserClaims = async request => {
  const claims = await wishlistRepo.getClaims(request.vparams.email);
  stripMetadata(claims, false);

  return {claims};
};

const claimItem = async request => {
  const wishlist = await wishlistRepo.getById(request.vparams.wishlistId);
  if (wishlist) {
    const newList = JSON.parse(JSON.stringify(wishlist));
    const found = newList.items.find(item => {
      return item._id === request.vparams.itemId;
    });

    if (found) {
      if (found.claimedBy) {
        throw new Exception(409, 'Item already claimed');
      }
      found.claimedBy = request.vparams.userId;

      const updatedWishlist = await wishlistRepo.update(newList.email, newList);

      const response = {
        wishlist: JSON.parse(JSON.stringify(updatedWishlist))
      };

      response.wishlist.id = updatedWishlist._id;
      delete response.wishlist._id;
      delete response.wishlist.__v;

      response.wishlist.items.forEach(item => {
        item.id = item._id;
        delete item._id;
      });

      return response;
    } else {
      throw new Error('Item not found in wishlist');
    }
  } else {
    throw new Error('Wishlist not found');
  }
};

const unclaimItem = async request => {
  const wishlist = await wishlistRepo.getById(request.vparams.wishlistId);
  if (wishlist) {
    const newList = JSON.parse(JSON.stringify(wishlist));
    const found = newList.items.find(item => {
      return item._id === request.vparams.itemId;
    });

    if (found) {
      if (!found.claimedBy) {
        throw new Exception(409, 'Item is not currently claimed');
      }
      delete found.claimedBy;

      const updatedWishlist = await wishlistRepo.update(newList.email, newList);

      const response = {
        wishlist: JSON.parse(JSON.stringify(updatedWishlist))
      };

      response.wishlist.id = updatedWishlist._id;
      delete response.wishlist._id;
      delete response.wishlist.__v;

      response.wishlist.items.forEach(item => {
        item.id = item._id;
        delete item._id;
      });

      return response;
    } else {
      throw new Error('Item not found in wishlist');
    }
  } else {
    throw new Error('Wishlist not found');
  }
};

module.exports = {
  getWishlists,
  getWishlistsVisibleByUser,
  getUserWishlist,
  updateUserWishlist,
  getUserClaims,
  claimItem,
  unclaimItem
};
