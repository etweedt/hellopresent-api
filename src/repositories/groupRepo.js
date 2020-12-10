'use strict';

const cosmos = require('../utils/cosmosHelper');
const redis = require('../utils/redisHelper');

const containerId = 'GROUPS';

const create = async group => {
  await redis.del('all-groups-key');
  return await cosmos.createContainerItem(containerId, group);
};

const getAll = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let allGroups = await redis.get('all-groups-key');

  if (allGroups) {
    allGroups = JSON.parse(allGroups);
  } else {
    allGroups = await cosmos.queryContainer(containerId, querySpec);

    if (allGroups) {
      await redis.set('all-groups-key', JSON.stringify(allGroups));
    }
  }
  
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

  let userGroup = await redis.get(`${userId}-group`);

  if (userGroup) {
    userGroup = JSON.parse(userGroup);
  } else {
    userGroup = (await cosmos.queryContainer(containerId, querySpec))[0];

    if (userGroup) {
      await redis.set(`${userId}-group`, JSON.stringify(userGroup));
    }
  }

  return userGroup;
};

const update = async group => {
  await redis.del('all-groups-key');
  await redis.del(`${group.userId}-group`);
  return await cosmos.updateContainerItem(containerId, group);
};

const remove = async userId => {
  const group = await getByUserId(userId);
  const removed = await cosmos.deleteContainerItem(containerId, group);

  await redis.del('all-groups-key');
  await redis.del(`${userId}-group`);
  
  return removed;
};

module.exports = {
  create,
  getAll,
  getByUserId,
  update,
  remove
};
