'use strict';

const mongo = require('../repositories/mongoRepository');

const getUserWishlist = async ctx => {
  try {
    const wishlist = await mongo.getWishlistForUser(ctx.params.id);
    ctx.body = {
      id: ctx.params.id,
      wishlist
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getUserWishlist
};
