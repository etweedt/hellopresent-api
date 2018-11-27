'use strict';

const createRoutes = router => {
  router.get('/helloworld', async (ctx, next) => {
    ctx.body = 'Hello, world!';
  });
};

module.exports = {
  createRoutes
};
