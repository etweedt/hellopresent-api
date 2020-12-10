'use strict';

const cosmos = require('../utils/cosmosHelper');
const redis = require('../utils/redisHelper');

const containerId = 'USERS';

const get = async email => {
  const querySpec = {
    query: 'SELECT * from c WHERE c.email = @email',
    parameters: [
      {
        name: '@email',
        value: email
      }
    ]
  };

  let user = await redis.get(`${email}-user`);

  if (user) {
    user = JSON.parse(user);
  } else {
    user = (await cosmos.queryContainer(containerId, querySpec))[0];
    
    if (user) {
      await redis.set(`${email}-user`, JSON.stringify(user));
    }
  }

  return user;
};

const getAll = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let users = await redis.get('all-users-key');

  if (users) {
    users = JSON.parse(users);
  } else {
    users = await cosmos.queryContainer(containerId, querySpec);

    if (users) {
      await redis.set('all-users-key', JSON.stringify(users));
    }
  }

  return users;
};

const create = async user => {
  const {resource: createdItem} = await cosmos.createContainerItem(
    containerId,
    user
  );

  await redis.del('all-users-key');

  return createdItem;
};

const update = async (email, updatedUser) => {
  const user = await get(email);

  if (user) {
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.address = updatedUser.address;

    const item = await cosmos.updateContainerItem(
      containerId,
      user
    );

    await redis.del('all-users-key');
    await redis.del(`${email}-user`);

    return item;
  } else {
    throw new Error('User not found');
  }
};

const remove = async email => {
  const user = await get(email);
  
  if (user) {
    const item = await cosmos.deleteContainerItem(containerId, user);

    await redis.del('all-users-key');
    await redis.del(`${email}-user`);

    return item;
  } else {
    throw new Error('User not found');
  }
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove
};
