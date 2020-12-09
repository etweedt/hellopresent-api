'use strict';

const userRepo = require('../repositories/userRepo');
const groupRepo = require('../repositories/groupRepo');
const {stripMetadata} = require('../utils/cosmosHelper');
const User = require('../models/user');
const Exception = require('../types/exception');

const getAllUsersHandler = async () => {
  const users = await userRepo.getAll();
  for (let user of users) {
    stripMetadata(user, false);
  }
  return users;
};

const getUserHandler = async request => {
  const email = request.vparams.email;
  let user = await userRepo.get(email);

  if (user) {
    stripMetadata(user, false);
  } else {
    await userRepo.create(new User(email));
    user = new User(email);
  }

  return user;
};

const updateUserHandler = async request => {
  const updated = {...request.vparams.user};

  try {
    const user = await userRepo.update(
      request.vparams.email,
      new User(
        request.vparams.email,
        updated.firstName,
        updated.lastName,
        updated.address
      )
    );

    stripMetadata(user, false);

    return user;
  } catch (err) {
    throw new Exception(404, err.message);
  }
};

const removeUserHandler = async request => {
  try {
    const removed = await userRepo.remove(request.vparams.email);
    if (removed) {
      stripMetadata(removed, false);
    }

    return removed;
  } catch (err) {
    throw new Exception(404, err.message);
  }
};

const getUserGroupHandler = async request => {
  const group = await groupRepo.getByUserId(request.vparams.email);

  if (group) {
    stripMetadata(group, false);
    return group;
  } else {
    throw new Exception(404, 'Group does not exist.');
  }
};

module.exports = {
  getAllUsersHandler,
  getUserHandler,
  updateUserHandler,
  removeUserHandler,
  getUserGroupHandler
};
