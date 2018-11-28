'use strict';

const Wishlist = require('../models/wishlist');

const get = () => {
  return Wishlist.find().catch(error => {
    throw error;
  });
};

const getForUser = userEmail => {
  return Wishlist.find({email: {$ne: userEmail}}).catch(error => {
    throw error;
  });
};

const getUser = userEmail => {
  return Wishlist.findOne({email: userEmail}).catch(error => {
    throw error;
  });
};

const create = userEmail => {
  return Wishlist.create({
    email: userEmail,
    items: []
  }).catch(error => {
    throw error;
  });
};

const update = (userEmail, newList) => {
  return Wishlist.findOneAndUpdate({email: userEmail}, newList, {
    new: true
  }).catch(error => {
    throw error;
  });
};

const getClaims = userEmail => {
  return Wishlist.find({items: {$elemMatch: {claimedBy: userEmail}}}).catch(
    error => {
      throw error;
    }
  );
};

module.exports = {
  get,
  getForUser,
  getUser,
  create,
  update,
  getClaims
};
