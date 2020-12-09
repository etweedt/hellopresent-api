'use strict';

const notificationRepo = require('../repositories/notificationRepo');
const {stripMetadata} = require('../utils/cosmosHelper');
const Notification = require('../models/notification');

const createNotification = async request => {
  const newNotification = new Notification(
    request.vparams.userId,
    request.vparams.message
  );
  const created = await notificationRepo.create(newNotification);
  stripMetadata(created, true);

  return created;
};

const markNotificationSeen = async request => {
  const notification = await notificationRepo.markSeen(
    request.vparams.notificationId
  );
  stripMetadata(notification, true);

  return notification;
};

const getUserNotifications = async request => {
  let notifications;

  if (request.vparams.unseenOnly) {
    notifications = await notificationRepo.getUnseen(request.vparams.userId);
  } else {
    notifications = await notificationRepo.getAll(request.vparams.userId);
  }

  for (let n of notifications) {
    stripMetadata(n, true);
  }

  return notifications;
};

const deleteNotification = async request => {
  const removed = await notificationRepo.deleteNotification(request.vparams.notificationId);

  return removed;
};

module.exports = {
  getUserNotifications,
  markNotificationSeen,
  createNotification,
  deleteNotification
};
