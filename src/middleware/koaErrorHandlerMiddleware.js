'use strict';

const Exception = require('../types/exception');

module.exports = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    if (err instanceof Exception) {
      // it transform the exception to an object literal
      ctx.body = err.toObject();
      ctx.status = err.statusCode;
    } else {
      console.log(JSON.stringify(err));
      if (err.statusCode === 401 || err.statusCode === 402) {
        ctx.status = err.statusCode;
        ctx.body = {message: err.message};
      } else if (err.message === 'validation error') {
        // route validation error
        ctx.body = {message: err.validationErrors};
        ctx.status = 400;
      } else {
        // unknow error
        ctx.body = {message: 'Unexpected error.'};
        ctx.status = 500;
      }
    }
  }
};
