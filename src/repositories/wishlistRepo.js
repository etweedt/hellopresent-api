'use strict';

const cosmos = require('../utils/cosmosHelper');

const containerId = 'WISHLISTS';

const get = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let wishlists = await cosmos.queryContainer(containerId, querySpec);

  return wishlists;
};

const getForUser = async userEmail => {
  const querySpec = {
    query: 'SELECT * from c WHERE c.email = @email',
    parameters: [
      {
        name: '@email',
        value: userEmail
      }
    ]
  };

  let wishlist = (await cosmos.queryContainer(containerId, querySpec))[0];

  return wishlist;
};

const create = async wishlist => {
  return await cosmos.createContainerItem(containerId, wishlist);
};

const update = async wishlist => {
  return await cosmos.updateContainerItem(containerId, wishlist);
};

const remove = async email => {
  const list = await getForUser(email);
  await cosmos.deleteContainerItem(containerId, list);

  return list;
};

module.exports = {
  get,
  getForUser,
  create,
  update,
  remove
};
