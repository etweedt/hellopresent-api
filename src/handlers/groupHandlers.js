'use strict';

const groupRepo = require('../repositories/groupRepo');
const userRepo = require('../repositories/userRepo');
const wishlistRepo = require('../repositories/wishlistRepo');
const Group = require('../models/group');
const Exception = require('../types/exception');
const notificationHelper = require('../utils/notificationHelper');
const {stripMetadata} = require('../utils/cosmosHelper');
const cosmosHelper = require('../utils/cosmosHelper');

const getUserGroupWithInfo = async email => {
  let group = await groupRepo.getByUserId(email);

  // Always create group if it does not exist.
  if (!group) {
    group = await groupRepo.create(new Group(email));
  }

  for (let member of group.members) {
    const memberInfo = await userRepo.get(member.email);

    if (memberInfo) {
      member.email = memberInfo.email;
      member.firstName = memberInfo.firstName;
      member.lastName = memberInfo.lastName;
      member.address = memberInfo.address;
    }
  }

  stripMetadata(group, true);

  return group;
};

const getAllGroups = async () => {
  const groups = await groupRepo.getAll();
  for (let g of groups) {
    stripMetadata(g, true);
  }

  return groups;
};

const getUserGroup = async request => {
  return await getUserGroupWithInfo(request.vparams.email);
};

const addGroupMember = async request => {
  if (request.vparams.memberId === request.vparams.email) {
    throw new Exception(409, 'Cannot add yourself.');
  }
  
  let userToAdd = await userRepo.get(request.vparams.memberId);
  if (!userToAdd) {
    throw new Exception(
      409,
      'The user you are attempting to add does not exist.'
    );
  }

  let group = await groupRepo.getByUserId(request.vparams.email);
  
  // Always create group if it does not exist.
  if (!group) {
    group = await groupRepo.create(new Group(request.vparams.email));
  }

  const found = group.members.find(mem => {
    return mem.email === request.vparams.memberId;
  });
  if (!found) {
    group.members.push({
      email: request.vparams.memberId
    });
  } else {
    throw new Exception(409, 'Member is already one of your friends.');
  }

  notificationHelper.addedFriend(
    request.vparams.email,
    request.vparams.memberId
  );
  await groupRepo.update(group);
  return await getUserGroupWithInfo(request.vparams.email);
};

const removeGroupMember = async request => {
  let group = await groupRepo.getByUserId(request.vparams.email);

  // Always create group if it does not exist.
  if (!group) {
    group = await groupRepo.create({
      userId: request.vparams.email,
      members: []
    });
  }

  const found = group.members.find(mem => {
    return mem.email === request.vparams.memberId;
  });
  if (!found) {
    throw new Exception(409, 'Member was not already one of your friends.');
  } else {
    group.members.splice(group.members.indexOf(found), 1);

    // Clean up any item claims from the removed member
    const removedMemberWishlist = await wishlistRepo.getForUser(request.vparams.memberId);
    let dirty = false;
    for (let item of removedMemberWishlist.items) {
      if (item.claimedBy === request.vparams.email) {
        delete item.claimedBy;
        dirty = true;
      }
    }

    if (dirty) {
      await wishlistRepo.update(removedMemberWishlist);
    }
  }

  await groupRepo.update(group);
  return await getUserGroupWithInfo(request.vparams.email);
};

const getMutualGroupMembers = async request => {
  const allGroups = await groupRepo.getAll();
  
  const response = {
    userId: request.vparams.email,
    members: []
  };

  for (let group of allGroups) {
    let memberInfo = await userRepo.get(group.userId);
    
    if (!memberInfo) {
      memberInfo = {
        email: group.userId,
        firstName: '',
        lastName: '',
        address: ''
      };
    }

    const found = group.members.find(mem => {
      return mem.email === request.vparams.email;
    });

    if (found) {
      response.members.push({
        email: group.userId,
        firstName: memberInfo.firstName,
        lastName: memberInfo.lastName,
        address: memberInfo.address
      });
    }
  }

  return response;
};

const remove = async email => {
  const group = getUserGroup(email);
  await cosmosHelper.deleteContainerItem(containerId, group);
  return group;
};

module.exports = {
  getAllGroups,
  getUserGroup,
  addGroupMember,
  removeGroupMember,
  getMutualGroupMembers,
  remove
};
