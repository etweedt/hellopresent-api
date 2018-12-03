'use strict';

const Group = require('../models/group');

const create = group => {
  return Group.create(group).catch(error => {
    throw error;
  });
};

const getByUserId = userId => {
  return Group.findOne({userId}).catch(error => {
    throw error;
  });
};

const getAll = () => {
  return Group.find().catch(error => {
    throw error;
  });
};

const update = (userId, group) => {
  return Group.findOneAndUpdate({userId}, group, {new: true}).catch(error => {
    throw error;
  });
};

const remove = userId => {
  return Group.findOneAndRemove({userId}).catch(error => {
    throw error;
  });
};

module.exports = {
  create,
  getByUserId,
  getAll,
  update,
  remove
};
