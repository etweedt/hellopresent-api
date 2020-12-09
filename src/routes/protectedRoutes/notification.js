'use strict';

const Route = require('../../types/route');
const notificationHandlers = require('../../handlers/notificationHandlers');

const getUserNotificationsSchema = {
  'GET /notifications/:userId': {
    properties: {
      userId: {
        type: 'string'
      },
      unseenOnly: {
        type: 'boolean'
      }
    },
    required: ['userId']
  }
};

const markUserNotificationAsSeenSchema = {
  'POST /notifications/:notificationId': {
    properties: {
      notificationId: {
        type: 'string'
      }
    },
    required: ['notificationId']
  }
};

const createNotificationSchema = {
  'POST /notifications/create/:userId': {
    properties: {
      userId: {
        type: 'string'
      },
      message: {
        type: 'string'
      }
    },
    required: ['userId', 'message']
  }
};

const deleteNotificationSchema = {
  'DELETE /notifications/:notificationId': {
    properties: {
      notificationId: {
        type: 'string'
      }
    },
    required: ['notificationId']
  }
};

module.exports = [
  new Route(
    '/notifications/:userId',
    'GET',
    null,
    getUserNotificationsSchema,
    notificationHandlers.getUserNotifications
  ),
  new Route(
    '/notifications/:notificationId',
    'POST',
    null,
    markUserNotificationAsSeenSchema,
    notificationHandlers.markNotificationSeen
  ),
  new Route(
    '/notifications/create/:userId',
    'POST',
    null,
    createNotificationSchema,
    notificationHandlers.createNotification
  ),
  new Route(
    '/notifications/:notificationId',
    'DELETE',
    null,
    deleteNotificationSchema,
    notificationHandlers.deleteNotification
  )
];
