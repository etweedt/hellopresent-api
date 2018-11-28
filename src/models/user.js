'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    trim: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  address: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
