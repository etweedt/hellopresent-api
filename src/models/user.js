'use strict';

class User {
  constructor(email, firstName, lastName, address) {
    this.email = email;
    this.firstName = firstName ? firstName : '';
    this.lastName = lastName ? lastName : '';
    this.address = address ? address : '';
  }

  get Email() {
    return this.email;
  }

  get FirstName() {
    return this.firstName;
  }

  set FirstName(value) {
    this.firstName = value;
  }

  get LastName() {
    return this.lastName;
  }

  set LastName(value) {
    this.lastName = value;
  }

  get Address() {
    return this.address;
  }

  set Address(value) {
    this.address = value;
  }
}

module.exports = User;
