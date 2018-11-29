'use strict';

const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  members: [
    {
      email: {
        type: String,
        trim: true,
        require: true
      }
    }
  ]
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
