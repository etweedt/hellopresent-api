'use strict';

// This class is mostly for reference or in case I split the items into their
// own separate table in the db.
class WishlistItem {
  constructor(name, description, url, notes, priceTier, claimedBy) {
    this.name = name ? name : '';
    this.description = description ? description : '';
    this.url = url ? url : '';
    this.notes = notes ? notes : '';
    this.priceTier = priceTier ? priceTier : 0;
    this.claimedBy = claimedBy ? claimedBy : '';
  }

  get Name() {
    return this.name;
  }

  set Name(value) {
    this.name = value;
  }

  get Description() {
    return this.name;
  }

  set Description(value) {
    this.name = value;
  }

  get Url() {
    return this.name;
  }

  set Url(value) {
    this.name = value;
  }

  get Notes() {
    return this.name;
  }

  set Notes(value) {
    this.name = value;
  }

  get PriceTier() {
    return this.name;
  }

  set PriceTier(value) {
    this.name = value;
  }

  get ClaimedBy() {
    return this.name;
  }

  set ClaimedBy(value) {
    this.name = value;
  }
}

module.exports = WishlistItem;
