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

  return await cosmos.queryContainer(containerId, querySpec);
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

  return (await cosmos.queryContainer(containerId, querySpec))[0];
};

const update = async group => {
  return await cosmos.updateContainerItem(containerId, group);
};

const remove = async userId => {
  const group = await getByUserId(userId);
  return await cosmos.deleteContainerItem(containerId, group);
};

module.exports = {
  create,
  getAll,
  getByUserId,
  getAll,
  update,
  remove
};
