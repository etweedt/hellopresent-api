'use strict';

const cosmos = require('../utils/cosmosHelper');
const redis = require('../utils/redisHelper');

const containerId = 'WISHLISTS';

const get = async () => {
  const querySpec = {
    query: 'SELECT * from c'
  };

  let wishlists = await redis.get('wishlists-all-key');

  if (wishlists) {
    wishlists = JSON.parse(wishlists);
  } else {
    wishlists = await cosmos.queryContainer(containerId, querySpec);

    if (wishlists) {
      await redis.set('wishlists-all-key', JSON.stringify(wishlists));
    }
  }

  return await cosmos.queryContainer(containerId, querySpec);
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

  let wishlist = await redis.get(`${userEmail}-wishlist`);

  if (wishlist) {
    wishlist = JSON.parse(wishlist);
  } else {
    wishlist = (await cosmos.queryContainer(containerId, querySpec))[0];

    if (wishlist) {
      await redis.set(`${userEmail}-wishlist`, JSON.stringify(wishlist));
    }
  }

  return wishlist;
};

const create = async wishlist => {
  await redis.del('wishlists-all-key');
  return await cosmos.createContainerItem(containerId, wishlist);
};

const update = async wishlist => {
  await redis.del('wishlists-all-key');
  await redis.del(`${wishlist.email}-wishlist`);
  return await cosmos.updateContainerItem(containerId, wishlist);
};

const remove = async email => {
  const list = await getForUser(email);
  await cosmos.deleteContainerItem(containerId, list);

  await redis.del('wishlists-all-key');
  await redis.del(`${email}-wishlist`);

  return list;
};

module.exports = {
  get,
  getForUser,
  create,
  update,
  remove
};
