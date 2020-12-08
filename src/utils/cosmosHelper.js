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
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer(containerId) {
  const {resource: containerDefinition} = await client
    .database(databaseId)
    .container(containerId)
    .read();
  const {resources: offers} = await client.offers.readAll().fetchAll();

  const newRups = 400;
  for (var offer of offers) {
    if (containerDefinition._rid !== offer.offerResourceId) {
      continue;
    }
    offer.content.offerThroughput = newRups;
    const offerToReplace = client.offer(offer.id);
    await offerToReplace.replace(offer);
    console.log(`Updated offer to ${newRups} RU/s`);
    break;
  }
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

    for (let container of containers) {
      await createContainer(container.id, container.path);
      await scaleContainer(container.id);
    }
  } catch (err) {
    exit(`Completed with error ${err.message}`);
  }
}

/**
 * Create item if it does not exist
 */
async function createContainerItem(containerId, itemBody) {
  const {item} = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);

  console.log(`Created item with id: ${item.id}`);

  return item;
}

/**
 * Replaces an item by id
 */
async function updateContainerItem(containerId, id, itemBody) {
  const {item} = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id)
    .replace(itemBody);

  console.log(`Updated item: ${item.id}`);
  return item;
}

/**
 * Get an item from a container by id
 */
async function queryContainerById(containerId, id) {
  const {item} = client.database(databaseId).container(containerId).item(id);

  return item;
}

/**
 * Query the container using SQL
 */
async function queryContainer(containerId, query) {
  // console.log(`Querying container:\n${config.container.id}`)

  // query to return all children in a family
  // Including the partition key value of lastName in the WHERE filter results in a more efficient query
  // const querySpec = {
  //   query: 'SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName',
  //   parameters: [
  //     {
  //       name: '@lastName',
  //       value: 'Andersen'
  //     }
  //   ]
  // }

  const {resources: results} = await client
    .database(databaseId)
    .container(containerId)
    .items.query(query)
    .fetchAll();

  return results;
}

/**
 * Remove an item
 */
async function deleteContainerItem(containerId, itemBody) {
  const {item} = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id)
    .delete(itemBody);

  console.log(`Deleted item: ${item.id}`);

  return item;
}

module.exports = {
  setup,
  createContainerItem,
  updateContainerItem,
  queryContainerById,
  queryContainer,
  deleteContainerItem
};
