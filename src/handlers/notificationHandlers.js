'use strict';

const notificationRepo = require('../repositories/notificationRepo');

const getUserNotifications = async request => {
  let notifications;

  if (request.vparams.unseenOnly) {
    notifications = await notificationRepo.getUnseen(request.vparams.userId);
  } else {
    notifications = await notificationRepo.getAll(request.vparams.userId);
  }

  const response = {
    notifications: []
  };
  notifications.forEach(notification => {
    const cleaned = JSON.parse(JSON.stringify(notification));
    cleaned.id = cleaned._id;
    delete cleaned._id;
    delete cleaned.__v;

    response.notifications.push(cleaned);
  });

  return response;
};

const markNotificationSeen = async request => {
  const notification = await notificationRepo.getById(
    request.vparams.notificationId
  );
  notification.seen = true;
  const updated = await notificationRepo.update(notification._id, notification);

  const response = JSON.parse(JSON.stringify(updated));
  updated.id = updated._id;
  delete updated._id;
  delete updated.__v;

  return response;
};

const createNotification = async request => {
  const newNotification = {
    userId: request.vparams.userId,
    message: request.vparams.message,
    date: new Date(),
    seen: false
  };

  const created = await notificationRepo.create(newNotification);
  const cleaned = JSON.parse(JSON.stringify(created));
  cleaned.id = cleaned._id;
  delete cleaned._id;
  delete cleaned.__v;

  return cleaned;
};

module.exports = {
  getUserNotifications,
  markNotificationSeen,
  createNotification
};
