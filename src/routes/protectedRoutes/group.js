'use strict';

const Route = require('../../types/route');
const groupHandlers = require('../../handlers/groupHandlers');

const getAllGroupsSchema = {
  'GET /groups': {
    properties: {},
    required: []
  }
};

const getUserGroupMembersSchema = {
  'GET /groups/:email': {
    properties: {
      email: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

const addMemberToUserGroupSchema = {
  'POST /groups/:email': {
    properties: {
      email: {
        type: 'string'
      },
      memberId: {
        type: 'string'
      }
    },
    required: ['email', 'memberId']
  }
};

const removeMemberFromUserGroupSchema = {
  'DELETE /groups/:email/:memberId': {
    properties: {
      email: {
        type: 'string'
      },
      memberId: {
        type: 'string'
      }
    },
    required: ['email', 'memberId']
  }
};

const getMutualGroupMembersSchema = {
  'GET /groups/mutual/:email': {
    properties: {
      email: {
        type: 'string'
      }
    },
    required: ['email']
  }
};

module.exports = [
  new Route(
    '/groups',
    'GET',
    null,
    getAllGroupsSchema,
    groupHandlers.getAllGroups
  ),
  new Route(
    '/groups/:email',
    'GET',
    null,
    getUserGroupMembersSchema,
    groupHandlers.getUserGroups
  ),
  new Route(
    '/groups/:email',
    'POST',
    null,
    addMemberToUserGroupSchema,
    groupHandlers.addGroupMember
  ),
  new Route(
    '/groups/:email/:memberId',
    'DELETE',
    null,
    removeMemberFromUserGroupSchema,
    groupHandlers.removeGroupMember
  ),
  new Route(
    '/groups/mutual/:email',
    'GET',
    null,
    getMutualGroupMembersSchema,
    groupHandlers.getMutualGroupMembers
  )
];
