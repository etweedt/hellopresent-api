'use strict';

const Router = require('koa-router');

const buildRouter = routes => {
  const router = new Router();

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    switch (route.Method) {
      case 'GET':
        router.get(route.Route, async ctx => {
          try {
            const response = await route.Handler(ctx);
            ctx.body = response;
          } catch (e) {
            ctx.status = e.statusCode || 500;
            ctx.body = e.message;
          }
        });
        break;
      case 'POST':
        router.post(route.Route, async ctx => {
          try {
            const response = await route.Handler(ctx);
            ctx.body = response;
          } catch (e) {
            ctx.status = e.statusCode || 500;
            ctx.body = e.message;
          }
        });
        break;
      case 'PUT':
        router.put(route.Route, async ctx => {
          try {
            const response = await route.Handler(ctx);
            ctx.body = response;
          } catch (e) {
            ctx.status = e.statusCode || 500;
            ctx.body = e.message;
          }
        });
        break;
      case 'DELETE':
        router.delete(route.Route, async ctx => {
          try {
            const response = await route.Handler(ctx);
            ctx.body = response;
          } catch (e) {
            ctx.status = e.statusCode || 500;
            ctx.body = e.message;
          }
        });
        break;
      default:
        break;
    }
  }
  return router;
};

const buildSchema = routes => {
  let schema = {};

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    schema = Object.assign(schema, route.Schema);
  }

  return schema;
};

module.exports = {
  buildRoutes: unprotectedRoutes => {
    return buildRouter(unprotectedRoutes);
  },
  buildRoutesSchema: routes => {
    return Object.assign(buildSchema(routes));
  }
};
