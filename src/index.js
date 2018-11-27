'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const {createRoutes} = require('./routes/routes');

const run = () => {
  const app = new Koa();
  const router = new Router();
  createRoutes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(5000);
};

run();
