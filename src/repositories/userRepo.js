'use strict';

const cosmos = require('../utils/cosmosHelper');
const containerId = 'USERS';

const get = async id => {
  return await cosmos.queryContainerById(containerId, id);
};

const getAll = async () => {
  return await cosmos.queryContainer();
};

const create = async user => {
  return await cosmos.createContainerItem();
};

const update = async (id, user) => {
  return await cosmos.updateContainerItem();
};

const remove = async id => {
  return await cosmos.deleteContainerItem();
};

const findUsers = async (id, group) => {
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
