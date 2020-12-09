'use strict';

const CosmosClient = require('@azure/cosmos').CosmosClient;
const {database, containers, endpoint, key} = require('../config').azure;

const client = new CosmosClient({endpoint, key});
const databaseId = database.id;

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const {database} = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database: ${database.id}`);
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const {resource: databaseDefinition} = await client
    .database(databaseId)
    .read();
  console.log(`Reading database: ${databaseDefinition.id}`);
}

/**
 * Create the container if it does not exist
 */
async function createContainer(containerId, path) {
  const {container} = await client
    .database(databaseId)
    .containers.createIfNotExists(
      {
        id: containerId,
        partitionKey: {kind: 'Hash', paths: [path]}
      },
      {offerThroughput: 400}
    );
  console.log(`Created container: ${container.id}.`);
}

/**
 * Read the container definition
 */
async function readContainer(containerId) {
  const {resource: containerDefinition} = await client
    .database(databaseId)
    .container(containerId)
    .read();

  console.log(`Reading container: ${containerDefinition.id}`);
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message);
  console.log('Press any key to exit');
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}

async function setup() {
  try {
    await createDatabase();
    await readDatabase();

    // I think this only needs to be done once
    for (let container of containers) {
      await createContainer(container.id, container.path);
      await readContainer(container.id);
    }
  } catch (err) {
    exit(`Completed with error ${err.message}`);
  }
}

/**
 * Create item if it does not exist
 */
async function createContainerItem(containerId, itemBody) {
  const {resource: createdItem} = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);

  console.log(`Created item with id: ${createdItem.id}`);

  return createdItem;
}

/**
 * Replaces an item by id
 */
async function updateContainerItem(containerId, itemBody) {
  const {resource: item} = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id)
    .replace(itemBody);

  console.log(`Updated item: ${item.id}`);
  return item;
}

/**
 * Query the container using SQL
 */
async function queryContainer(containerId, query) {
  const {resources: results} = await client
    .database(databaseId)
    .container(containerId)
    .items.query(query)
    .fetchAll();

  return results;
}

async function getById(containerId, itemId) {
  const {resource: item} = await client
    .database(databaseId)
    .container(containerId)
    .item(itemId).read();
  
  return item;
}

/**
 * Remove an item
 */
async function deleteContainerItem(containerId, itemBody) {
  const item = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id)
    .delete(itemBody);

  console.log(`Deleted item: ${itemBody.id}`);

  return itemBody;
}

function stripMetadata(item, leaveId) {
  if (!leaveId) {
    delete item.id;
  }
  delete item._rid;
  delete item._self;
  delete item._etag;
  delete item._attachments;
  delete item._ts;
}

module.exports = {
  setup,
  createContainerItem,
  updateContainerItem,
  getById,
  queryContainer,
  deleteContainerItem,
  stripMetadata
};
