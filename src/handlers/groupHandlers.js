'use strict';

const groupRepo = require('../repositories/groupRepo');
const Exception = require('../types/exception');

const getUserGroups = async request => {
  let group = await groupRepo.getByUserId(request.vparams.id);
  if (!group) {
    group = await groupRepo.create({
      userId: request.vparams.id,
      members: []
    });
  }

  const response = JSON.parse(JSON.stringify(group));
  response.id = response._id;
  delete response._id;
  delete response.__v;

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

  const updated = await groupRepo.update(request.vparams.id, newGroup);
  const response = JSON.parse(JSON.stringify(updated));

  response.id = response._id;
  delete response._id;
  delete response.__v;

  return response;
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

  const updated = await groupRepo.update(request.vparams.id, newGroup);
  const response = JSON.parse(JSON.stringify(updated));

  response.id = response._id;
  delete response._id;
  delete response.__v;

  return response;
};

module.exports = {
  getUserGroups,
  addGroupMember,
  removeGroupMember
};
