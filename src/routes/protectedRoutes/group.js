'use strict';

const Route = require('../../types/route');
const groupHandlers = require('../../handlers/groupHandlers');

const getUserGroupMembersSchema = {
  'GET /groups/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

const addMemberToUserGroupSchema = {
  'POST /groups/:id': {
    properties: {
      id: {
        type: 'string'
      },
      memberId: {
        type: 'string'
      }
    },
    required: ['id', 'memberId']
  }
};

const removeMemberFromUserGroupSchema = {
  'DELETE /groups/:id/:memberId': {
    properties: {
      id: {
        type: 'string'
      },
      memberId: {
        type: 'string'
      }
    },
    required: ['id', 'memberId']
  }
};

const getMutualGroupMembersSchema = {
  'GET /groups/mutual/:id': {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  }
};

module.exports = [
  new Route(
    '/groups/:id',
    'GET',
    null,
    getUserGroupMembersSchema,
    groupHandlers.getUserGroups
  ),
  new Route(
    '/groups/:id',
    'POST',
    null,
    addMemberToUserGroupSchema,
    groupHandlers.addGroupMember
  ),
  new Route(
    '/groups/:id/:memberId',
    'DELETE',
    null,
    removeMemberFromUserGroupSchema,
    groupHandlers.removeGroupMember
  ),
  new Route(
    '/groups/mutual/:id',
    'GET',
    null,
    getMutualGroupMembersSchema,
    groupHandlers.getMutualGroupMembers
  )
];
