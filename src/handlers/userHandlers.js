'use strict';

const userRepo = require('../repositories/userRepo');

const getAllUsersHandler = async request => {
  const users = await userRepo.getAll();
  const response = JSON.parse(JSON.stringify(users));
  response.forEach(user => {
    user.id = user._id;
    delete user._id;
    delete user.__v;
  });

  return response;
};

const getUserHandler = async request => {
  let user = await userRepo.get(request.vparams.id);

  if (!user) {
    user = await userRepo.create({
      _id: request.vparams.id
    });
  }

  const response = JSON.parse(JSON.stringify(user));
  response.id = user._id;
  delete response._id;
  delete response.__v;

  return response;
};

const updateUserHandler = async request => {
  const updated = await userRepo.update(
    request.vparams.id,
    request.vparams.user
  );

  const response = JSON.parse(JSON.stringify(updated));
  response.id = updated._id;
  delete response._id;
  delete response.__v;

  return response;
};

const removeUserHandler = async request => {
  const removed = await userRepo.remove(request.vparams.id);

  const response = JSON.parse(JSON.stringify(removed));
  response.id = removed._id;
  delete response._id;
  delete response.__v;

  return response;
};

const getUserGroupHandler = async request => {
  const group = await userRepo.findUsers(request.vparams.id);

  const response = {
    members: JSON.parse(JSON.stringify(group))
  };

  response.members.forEach(member => {
    member.id = member._id;
    delete member._id;
    delete member.__v;
  });
  return response;
};

module.exports = {
  getAllUsersHandler,
  getUserHandler,
  updateUserHandler,
  removeUserHandler,
  getUserGroupHandler
};
