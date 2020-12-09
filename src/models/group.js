'use strict';

class Group {
  constructor(userId, members) {
    this.userId = userId;
    this.members = members ? members : [];
  }

  get UserId() {
    return this.userId;
  }

  get Members() {
    return this.members;
  }

  set Members(value) {
    this.members = value;
  }
}

module.exports = Group;
