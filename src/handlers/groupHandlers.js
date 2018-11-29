'use strict';

const groupRepo = require('../repositories/groupRepo');
const userRepo = require('../repositories/userRepo');
const Exception = require('../types/exception');

const getUserGroupsWithInfo = async groupId => {
  let group = await groupRepo.getByUserId(groupId);
  if (!group) {
    group = await groupRepo.create({
      userId: request.vparams.id,
      members: []
    });
  }

  const alteredGroup = JSON.parse(JSON.stringify(group));

  for (let member of alteredGroup.members) {
    const memberInfo = await userRepo.get(member.email);
    member.firstName = memberInfo.firstName;
    member.lastName = memberInfo.lastName;
    member.address = memberInfo.address;
  }

  alteredGroup.id = alteredGroup._id;
  delete alteredGroup._id;
  delete alteredGroup.__v;

  return alteredGroup;
};

const getUserGroups = async request => {
  const response = await getUserGroupsWithInfo(request.vparams.id);

  return response;
};

const addGroupMember = async request => {
  let group = await groupRepo.getByUserId(request.vparams.id);
  if (!group) {
    group = await groupRepo.create({
      userId: request.vparams.id,
      members: []
    });
  }

  const newGroup = JSON.parse(JSON.stringify(group));
  const found = newGroup.members.find(mem => {
    return mem.email === request.vparams.memberId;
  });
  if (!found) {
    newGroup.members.push({
      email: request.vparams.memberId
    });
  } else {
    throw new Exception(409, 'Member is already one of your friends.');
  }

  await groupRepo.update(request.vparams.id, newGroup);
  return await getUserGroupsWithInfo(request.vparams.id);
};

const removeGroupMember = async request => {
  let group = await groupRepo.getByUserId(request.vparams.id);

  if (!group) {
    group = await groupRepo.create({
      userId: request.vparams.id,
      members: []
    });
  }

  const newGroup = JSON.parse(JSON.stringify(group));
  const found = newGroup.members.find(mem => {
    return mem.email === request.vparams.memberId;
  });
  if (!found) {
    throw new Exception(409, 'Member was not already one of your friends.');
  } else {
    newGroup.members.splice(newGroup.members.indexOf(found), 1);
  }

  await groupRepo.update(request.vparams.id, newGroup);
  return await getUserGroupsWithInfo(request.vparams.id);
};

module.exports = {
  getUserGroups,
  addGroupMember,
  removeGroupMember
};
