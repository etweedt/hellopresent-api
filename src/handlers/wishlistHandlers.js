'use strict';

const mongoRepo = require('../repositories/mongoRepo');

const getNonUserWishlists = async ctx => {};

const addItemToUserWishlist = async ctx => {};

const editUserWishlistItem = async ctx => {};

const deleteUserWishlistItem = async ctx => {};

const claimItem = async ctx => {};

const unclaimItem = async ctx => {};

module.exports = {
  getNonUserWishlists,
  addItemToUserWishlist,
  editUserWishlistItem,
  deleteUserWishlistItem,
  claimItem,
  unclaimItem
};
