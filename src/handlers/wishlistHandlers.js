'use strict';

const wishlistRepo = require('../repositories/wishlistRepo');
const userRepo = require('../repositories/userRepo');
const Exception = require('../types/exception');
const notificationHelper = require('../utils/notificationHelper');

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

  response.wishlist.items.forEach(item => {
    item.id = item._id;
    delete item._id;
  });

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

  notificationHelper.updatedWishlist(
    request.vparams.id,
    request.vparams.message ? request.vparams.message : null
  );

  return response;
};

const getUserClaims = async request => {
  const claims = await wishlistRepo.getClaims(request.vparams.id);

  const response = {
    claims: []
  };

  const lists = JSON.parse(JSON.stringify(claims));

  for (const list of lists) {
    const userInfo = await userRepo.get(list.email);

    const newClaim = {
      email: list.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      address: userInfo.address,
      id: list._id,
      items: []
    };

    list.items.forEach(item => {
      if (item.claimedBy === request.vparams.id) {
        item.id = item._id;
        delete item._id;
        newClaim.items.push(item);
      }
    });

    response.claims.push(newClaim);
  }

  return response;
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
