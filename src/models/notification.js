'use strict';

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    required: true
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
