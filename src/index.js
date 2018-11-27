'use strict';

const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const ROUTER = require('./routes');
const mongoRepo = require('./repositories/mongoRepository');

const SERVER = new Koa();

// Connect to database
mongoRepo.connectToMongo()
  .then(() => {
    // middlewares
    SERVER.use(BodyParser());

    SERVER.use(async (ctx, next) => {
      try {
        return next();
      } catch (err) {
        console.error(err);
        ctx.body = {message: 'Unexpected error.'};
        ctx.status = 500;
      }
    });
    SERVER.use(ROUTER.routes());

    SERVER.listen(5000);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
