'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const WishlistSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuid()
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  items: [
    {
      name: {
        type: String,
        required: true
      },
      description: String,
      url: {
        type: String,
        trim: true
      },
      notes: String,
      priceTier: Number,
      claimedBy: {
        type: String,
        trim: true
      }
    }
  ]
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;
