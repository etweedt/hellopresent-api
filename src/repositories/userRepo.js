'use strict';

const cosmos = require('../utils/cosmosHelper');

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

  let user = (await cosmos.queryContainer(containerId, querySpec))[0];

  return user;
};

const getAll = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let users = await cosmos.queryContainer(containerId, querySpec);

  return users;
};

const create = async user => {
  const {resource: createdItem} = await cosmos.createContainerItem(
    containerId,
    user
  );

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

    return item;
  } else {
    throw new Error('User not found');
  }
};

const remove = async email => {
  const user = await get(email);
  
  if (user) {
    const item = await cosmos.deleteContainerItem(containerId, user);

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
