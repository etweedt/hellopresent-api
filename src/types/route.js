'use strict';

class Route {
  constructor(route, method, acl, schema, handler) {
    this.route = route;
    this.method = method;
    this.acl = acl || {};
    this.schema = schema || {};
    this.handler = handler;
  }

  get Route() {
    return this.route;
  }

  get Method() {
    return this.method;
  }

  get Handler() {
    return this.handler;
  }

  get Acl() {
    return this.acl;
  }

  get Schema() {
    return this.schema;
  }
}

module.exports = Route;
