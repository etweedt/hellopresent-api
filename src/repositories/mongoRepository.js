'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
let client;

const connectToMongo = () => {
  const connectionString = `mongodb://${config.mongoUsername}:${
    config.mongoPassword
  }@${config.mongoServer}:${config.mongoPort}`;

  console.log(connectionString);
  client = new MongoClient(connectionString, {useNewUrlParser: true});

  return new Promise((resolve, reject) => {
    client.connect(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getWishlistsForAllButUser = id => {
  return new Promise((resolve, reject) => {
    if (!client.isConnected) {
      reject('Mongo not connected!');
    } else {
      const db = client.db('hellopresents-db');
      const collection = db.collection('wishlists');
      collection.find({}).toArray((err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    }
  });
};

const getWishlistForUser = id => {
  return new Promise((resolve, reject) => {
    if (!client.isConnected) {
      reject('Mongo not connected!');
    } else {
      const db = client.db('hellopresents-db');
      const collection = db.collection('wishlists');
      collection.find({}).toArray((err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    }
  });
};

module.exports = {
  connectToMongo,
  getWishlistsForAllButUser,
  getWishlistForUser
};
