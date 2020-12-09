'use strict';

const cosmos = require('../utils/cosmosHelper');
const containerId = 'NOTIFICATIONS';

const create = async notification => {
  const item = cosmos.createContainerItem(containerId, notification);

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
  return await cosmos.queryContainer(containerId, querySpec);
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
  return await cosmos.queryContainer(containerId, querySpec);
};

const markSeen = async notificationId => {
  const notification = await cosmos.getById(containerId, notificationId);
  notification.seen = true;

  const item = await cosmos.updateContainerItem(
    containerId,
    notification
  );

  return item;
};

const deleteNotification = async notificationId => {
  const notification = await cosmos.getById(containerId, notificationId);
  const deleted = await cosmos.deleteContainerItem(containerId, notification);

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
