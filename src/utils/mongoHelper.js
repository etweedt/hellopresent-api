'use strict';

const mongoose = require('mongoose');
const retry = require('async-retry');
const config = require('../config');

const connectToMongo = () => {
  return new Promise(resolve => {
    mongoose.disconnect(err => {
      if (err) {
        console.error(`Error closing mongo connection: ${err}`);
        throw err;
      }

      const url = `mongodb://${config.mongoServer}/hellopresent?connectTimeoutMS=30000`;
      console.log(url);

      retry(async () => {
        console.log('connecting...');
        await mongoose.connect(
          url,
          {useNewUrlParser: true}
        );
        console.log(`Mongo connected. server: ${config.mongoServer}`);
        resolve();
      }, config.retry).catch(error => {
        console.error(`Failed to connect to MongoDB: ${error}`);
        throw error;
      });
    });
  });
};

module.exports = {
  connectToMongo
};
