'use strict';

const wishlistRepo = require('../repositories/wishlistRepo');

const getWishlists = async () => {
  const wishlists = await wishlistRepo.get();
  const response = [];

  wishlists.forEach(wl => {
    const newList = JSON.parse(JSON.stringify(wl));
    newList.id = wl._id;
    delete newList._id;
    delete newList.__v;

    response.push(newList);
  });

  return response;
};

const getWishlistsVisibleByUser = async request => {
  const wishlists = await wishlistRepo.getForUser(request.vparams.id);
  const response = {
    wishlists: []
  };

  wishlists.forEach(wl => {
    const newList = JSON.parse(JSON.stringify(wl));
    newList.id = wl._id;
    delete newList._id;
    delete newList.__v;

    response.wishlists.push(newList);
  });

  return response;
};

const getUserWishlist = async request => {
  let wishlist = await wishlistRepo.getUser(request.vparams.id);

  if (!wishlist) {
    wishlist = await wishlistRepo.create(request.vparams.id);
  }

  const response = {
    wishlist: JSON.parse(JSON.stringify(wishlist))
  };
  response.wishlist.id = wishlist._id;
  delete response.wishlist._id;
  delete response.wishlist.__v;

  return response;
};

const updateUserWishlist = async request => {
  const wishlist = await wishlistRepo.update(
    request.vparams.id,
    request.vparams.wishlist
  );

  const response = {
    wishlist: JSON.parse(JSON.stringify(wishlist))
  };

  response.wishlist.id = wishlist._id;
  delete response._id;
  delete response.__v;

  return response;
};

module.exports = {
  getWishlists,
  getWishlistsVisibleByUser,
  getUserWishlist,
  updateUserWishlist
};
