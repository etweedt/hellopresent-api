'use strict';

class Notification {
  constructor(userId, message) {
    this.userId = userId;
    this.message = message ? message : '';
    this.seen = false;
    this.date = new Date();
  }

  get UserId() {
    return this.userId;
  }

  get Message() {
    return this.message;
  }

  set Message(value) {
    this.message = value;
  }

  get Seen() {
    return this.seen;
  }

  set Seen(value) {
    this.seen = value;
  }

  get Date() {
    return this.date;
  }
}

module.exports = Notification;
