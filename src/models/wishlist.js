'use strict';

class Wishlist {
  constructor(email, items) {
    this.email = email;
    this.items = items ? items : []
  }

  get Email() {
    return this.email;
  }

  get Items() {
    return this.items;
  }

  set Items(value) {
    this.items = value;
  }
}

module.exports = Wishlist;
