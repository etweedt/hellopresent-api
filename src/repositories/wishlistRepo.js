'use strict';

const cosmos = require('../utils/cosmosHelper');
const containerId = 'WISHLISTS';

const get = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  return await cosmos.queryContainer(containerId, querySpec);
};

const getById = async id => {
  return await cosmos.getById(containerId, id);
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

  return await cosmos.queryContainer(containerId, querySpec);
};

const create = async wishlist => {
  return await cosmos.createContainerItem(containerId, wishlist);
};

const update = async wishlist => {
  return await cosmos.updateContainerItem(containerId, wishlist);
};

const getClaims = async userEmail => {
  const querySpec = {
    query: 'SELECT [w.items] AS item FROM Wishlist w WHERE w.items.claimedBy = @email',
    parameters: [
      {
        name: '@email',
        value: userEmail
      }
    ]
  };

  return await cosmos.queryContainer(containerId, querySpec);
};

module.exports = {
  get,
  getById,
  getForUser,
  create,
  update,
  getClaims
};
