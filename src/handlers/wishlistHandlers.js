'use strict';

const mongo = require('../repositories/mongoRepository');

const getAllWishlists = async ctx => {
  try {
    const wishlists = await mongo.getWishlistsForAllButUser(ctx.params.id);
    ctx.body = {
      wishlists
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getAllWishlists
};
