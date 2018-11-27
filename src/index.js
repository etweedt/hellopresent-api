'use strict';

const Koa = require('koa');
const koaBody = require('koa-body');
const koaAjv = require('koa-ajv');
const Boom = require('boom');
const cors = require('koa2-cors');
const swagger = require('swagger-injector');
const swaggerSpec = require('./swaggerSpec');
const auth0 = require('./middleware/auth0Middleware');
const koaErrorHandler = require('./middleware/koaErrorHandlerMiddleware');
const routerBuilder = require('./utils/routerBuilder');
const unprotectedRoutes = require('./routes/unprotectedRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const mongo = require('./utils/mongoHelper');

// Main routine
const start = async () => {
  try {
    await mongo.connectToMongo();

    const app = new Koa();

    app.use(cors());
    app.use(koaBody());
    app.use(koaErrorHandler);
    app.use(
      swagger.koa({
        swagger: swaggerSpec,
        route: '/documentation'
      })
    );

    // setup validation
    const schema = routerBuilder.buildRoutesSchema(
      [].concat(unprotectedRoutes, protectedRoutes)
    );
    app.use(
      koaAjv({
        strict: false,
        debug: true,
        routes: schema
      })
    );

    const unprotectedRouter = routerBuilder.buildRoutes(unprotectedRoutes);
    app.use(
      unprotectedRouter.allowedMethods({
        throw: false,
        notImplemented: () => new Boom.notImplemented(),
        methodNotAllowed: () => new Boom.methodNotAllowed()
      })
    );

    // Unprotected routes go here
    app.use(unprotectedRouter.routes());

    // app.use(auth0.setup());

    const protectedRouter = routerBuilder.buildRoutes(protectedRoutes);
    app.use(
      protectedRouter.allowedMethods({
        throw: false,
        notImplemented: () => new Boom.notImplemented(),
        methodNotAllowed: () => new Boom.methodNotAllowed()
      })
    );

    // Auth protected routes go here
    app.use(protectedRouter.routes());

    app.listen(5000);

    console.log('Server is started');
  } catch (e) {
    console.error('Error starting server: ' + e.message);
  }
};

start();
