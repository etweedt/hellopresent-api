'use strict';

const Notification = require('../models/notification');

const create = notification => {
  return Notification.create(notification).catch(error => {
    throw error;
  });
};

const getById = notificationId => {
  return Notification.findById(notificationId).catch(error => {
    throw error;
  });
};

const getUnseen = userId => {
  return Notification.find({userId, seen: false}).catch(error => {
    throw error;
  });
};

const getAll = userId => {
  return Notification.find({userId}).catch(error => {
    throw error;
  });
};

const update = (id, notification) => {
  return Notification.findByIdAndUpdate(id, notification, {new: true}).catch(
    error => {
      throw error;
    }
  );
};

module.exports = {
  create,
  getById,
  getUnseen,
  getAll,
  update
};
