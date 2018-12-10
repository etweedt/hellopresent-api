'use strict';

const notificationRepo = require('../repositories/notificationRepo');
const userRepo = require('../repositories/userRepo');
const groupRepo = require('../repositories/groupRepo');

const updatedWishlist = async (userId, message) => {
  const user = await userRepo.get(userId);
  const groups = await groupRepo.getAll();

  // Build name
  let name = '';
  if (user.firstName) {
    name += user.firstName;
  }
  if (user.lastName) {
    name += ` ${user.lastName}`;
  }

  if (name.length === 0) {
    name = userId;
  }

  let text;
  if (message) {
    text = `${name} ${message}`;
  } else {
    text = `${name} made an update to their wishlist!`;
  }

  // Find members
  for (let group of groups) {
    const found = group.members.find(mem => {
      return mem.email === userId;
    });

    // Create notification
    if (found) {
      const notification = {
        message: text,
        date: new Date(),
        seen: false,
        userId: group.userId
      };

      await notificationRepo.create(notification);
    }
  }
};

const addedFriend = async (userId, friendId) => {
  const user = await userRepo.get(userId);

  // Build name
  let name = '';
  if (user.firstName) {
    name += user.firstName;
  }
  if (user.lastName) {
    name += ` ${user.lastName}`;
  }

  if (name.length === 0) {
    name = userId;
  }

  // Create notification
  const notification = {
    message: `${name} added you to their group!`,
    date: new Date(),
    seen: false,
    userId: friendId
  };

  await notificationRepo.create(notification);
};

module.exports = {
  updatedWishlist,
  addedFriend
};
