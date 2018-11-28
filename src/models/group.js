'use strict';

const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  _id: {
    type: String,
    trim: true,
    required: true,
    unique: true
  }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
