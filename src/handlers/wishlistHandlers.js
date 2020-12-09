'use strict';

const wishlistRepo = require('../repositories/wishlistRepo');
const groupRepo = require('../repositories/groupRepo');
const userRepo = require('../repositories/userRepo');
const {stripMetadata} = require('../utils/cosmosHelper');
const Group = require('../models/group');
const Wishlist = require('../models/wishlist');
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
  let wishlist = await wishlistRepo.getForUser(request.vparams.email);

  if (!wishlist) {
    wishlist = await wishlistRepo.create(new Wishlist(request.vparams.email));
  }

  stripMetadata(wishlist, false);

  return {wishlist};
};

const updateUserWishlist = async request => {
  const wishlist = await wishlistRepo.getForUser(request.vparams.email);
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
  const claims = [];
  let group = await groupRepo.getByUserId(request.vparams.email);

  // Always create group if it does not exist.
  if (!group) {
    group = await groupRepo.create(new Group(request.vparams.email));
  }

  for (let member of group.members) {
    const wishlist = await wishlistRepo.getForUser(member.email);
    const claimedItems = [];

    for (let item of wishlist.items) {
      if (item.claimedBy === request.vparams.email) {
        claimedItems.push(item);
      }
    }

    if (claimedItems.length > 0) {
      const user = await userRepo.get(member.email);
      claims.push({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        items: claimedItems
      });
    }
  }

  return {claims};
};

const claimItem = async request => {
  const wishlist = await wishlistRepo.getForUser(request.vparams.wishlistId);
  if (wishlist) {
    const found = wishlist.items.find(item => {
      return item.name === request.vparams.item.name;
    });

    if (found) {
      if (found.claimedBy) {
        throw new Exception(409, 'Item already claimed');
      }
      found.claimedBy = request.vparams.userId;

      const updatedWishlist = await wishlistRepo.update(wishlist);
      stripMetadata(updatedWishlist, false);

      return {wishlist: updatedWishlist};
    } else {
      throw new Error('Item not found in wishlist');
    }
  } else {
    throw new Error('Wishlist not found');
  }
};

const unclaimItem = async request => {
  const wishlist = await wishlistRepo.getForUser(request.vparams.wishlistId);
  if (wishlist) {
    const found = wishlist.items.find(item => {
      return item.name === request.vparams.item.name;
    });

    if (found) {
      if (!found.claimedBy) {
        throw new Exception(409, 'Item is not currently claimed');
      }
      delete found.claimedBy;

      const updatedWishlist = await wishlistRepo.update(wishlist);
      stripMetadata(updatedWishlist, false);

      return {wishlist: updatedWishlist};
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
