'use strict';

const cosmos = require('../utils/cosmosHelper');
const redis = require('../utils/redisHelper');

const containerId = 'NOTIFICATIONS';

const create = async notification => {
  const item = await cosmos.createContainerItem(containerId, notification);
  await redis.del('notifications-all');
  await redis.del('notifications-unseen');
  return item;
};

const getById = async notificationId => {
  return await cosmos.getById(containerId, notificationId);
};

const getUnseen = async userId => {
  const querySpec = {
    query: 'SELECT * from c WHERE c.seen = @seen AND c.userId = @userId',
    parameters: [
      {
        name: '@seen',
        value: false
      },
      {
        name: '@userId',
        value: userId
      }
    ]
  };

  let notifications = await redis.get('notifications-unseen');

  if (notifications) {
    notifications = JSON.parse(notifications);
  } else {
    notifications = await cosmos.queryContainer(containerId, querySpec);

    if (notifications) {
      await redis.set('notifications-unseen', JSON.stringify(notifications));
    }
  }

  return notifications;
};

const getAll = async userId => {
  const querySpec = {
    query: 'SELECT * from c WHERE c.userId = @userId',
    parameters: [
      {
        name: '@userId',
        value: userId
      }
    ]
  };

  let notifications = await redis.get('notifications-all');
  
  if (notifications) {
    notifications = JSON.parse(notifications);
  } else {
    notifications = await cosmos.queryContainer(containerId, querySpec);

    if (notifications) {
      await redis.set('notifications-all', JSON.stringify(notifications));
    }
  }

  return notifications;
};

const markSeen = async notificationId => {
  const notification = await cosmos.getById(containerId, notificationId);
  notification.seen = true;

  const item = await cosmos.updateContainerItem(
    containerId,
    notification
  );

  await redis.del('notifications-all');
  await redis.del('notifications-unseen');

  return item;
};

const deleteNotification = async notificationId => {
  const notification = await cosmos.getById(containerId, notificationId);
  const deleted = await cosmos.deleteContainerItem(containerId, notification);

  await redis.del('notifications-all');
  await redis.del('notifications-unseen');

  return deleted;
};

module.exports = {
  create,
  getById,
  getUnseen,
  getAll,
  markSeen,
  deleteNotification
};
