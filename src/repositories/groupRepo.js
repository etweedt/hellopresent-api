'use strict';

const cosmos = require('../utils/cosmosHelper');
const containerId = 'GROUPS';

const create = async group => {
  return await cosmos.createContainerItem(containerId, group);
};

const getAll = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let allGroups = await cosmos.queryContainer(containerId, querySpec);
  
  return allGroups;
};

const getByUserId = async userId => {
  const querySpec = {
    query: 'SELECT * from c WHERE c.userId = @userId',
    parameters: [
      {
        name: '@userId',
        value: userId
      }
    ]
  };

  let  userGroup = (await cosmos.queryContainer(containerId, querySpec))[0];

  return userGroup;
};

const update = async group => {
  return await cosmos.updateContainerItem(containerId, group);
};

const remove = async userId => {
  const group = await getByUserId(userId);
  const removed = await cosmos.deleteContainerItem(containerId, group);

  return removed;
};

module.exports = {
  create,
  getAll,
  getByUserId,
  update,
  remove
};
