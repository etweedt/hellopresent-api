'use strict';

const Route = require('../../types/route');
const userHandlers = require('../../handlers/userHandlers');

const getUserSchema = {
  'GET /users/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

const updateUserSchema = {
  'POST /users/:id': {
    properties: {
      id: {
        type: 'string'
      },
      user: {
        type: 'object'
      }
    },
    required: ['id', 'user']
  }
};

const removeUserSchema = {
  'DELETE /users/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

const getUsersGroupMembersSchema = {
  'GET /users/group/:id': {
    properties: {
      id: {
        type: 'string'
      },
      group: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

module.exports = [
  new Route(
    '/users',
    'GET',
    null,
    null,
    userHandlers.getAllUsersHandler
  ),
  new Route(
    '/users/:id',
    'GET',
    null,
    getUserSchema,
    userHandlers.getUserHandler
  ),
  new Route(
    '/users/:id',
    'POST',
    null,
    updateUserSchema,
    userHandlers.updateUserHandler
  ),
  new Route(
    '/users/:id',
    'DELETE',
    null,
    removeUserSchema,
    userHandlers.removeUserHandler
  ),
  new Route(
    '/users/group/:id',
    'GET',
    null,
    getUsersGroupMembersSchema,
    userHandlers.getUserGroupHandler
  )
];
