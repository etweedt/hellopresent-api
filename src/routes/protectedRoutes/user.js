'use strict';

const Route = require('../../types/route');
const userHandlers = require('../../handlers/userHandlers');

const getUserSchema = {
  'GET /users/:email': {
    properties: {
      email: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const updateUserSchema = {
  'POST /users/:email': {
    properties: {
      email: {
        type: 'string'
      },
      user: {
        type: 'object'
      }
    },
    required: ['email', 'user']
  }
};

const removeUserSchema = {
  'DELETE /users/:email': {
    properties: {
      email: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const getUsersGroupMembersSchema = {
  'GET /users/group/:email': {
    properties: {
      email: {
        type: 'string'
      },
      group: {
        type: 'string'
      }
    },
    required: ['email']
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
    '/users/:email',
    'GET',
    null,
    getUserSchema,
    userHandlers.getUserHandler
  ),
  new Route(
    '/users/:email',
    'POST',
    null,
    updateUserSchema,
    userHandlers.updateUserHandler
  ),
  new Route(
    '/users/:email',
    'DELETE',
    null,
    removeUserSchema,
    userHandlers.removeUserHandler
  ),
  new Route(
    '/users/group/:email',
    'GET',
    null,
    getUsersGroupMembersSchema,
    userHandlers.getUserGroupHandler
  )
];
