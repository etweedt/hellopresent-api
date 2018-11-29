'use strict';

const User = require('../models/user');

const get = id => {
  return User.findById(id).catch(error => {
    throw error;
  });
};

const getAll = () => {
  return User.find().catch(error => {
    throw error;
  });
};

const create = user => {
  return User.create(user).catch(error => {
    throw error;
  });
};

const update = (id, user) => {
  return User.findByIdAndUpdate(id, user, {new: true}).catch(error => {
    throw error;
  });
};

const remove = id => {
  return User.findByIdAndRemove(id).catch(error => {
    throw error;
  });
};

const findUsers = (id, group) => {
  return User.find({_id: {$ne: id}, firstName: {$ne: null}}).catch(error => {
    throw error;
  });
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
  findUsers
};
