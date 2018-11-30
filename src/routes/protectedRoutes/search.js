'use strict';

const Route = require('../../types/route');
const searchHandlers = require('../../handlers/searchHandlers');

const getSearchResultsSchema = {
  'GET /search': {
    properties: {
      searchString: {
        type: 'string'
      },
      userId: {
        type: 'string'
      }
    },
    required: ['searchString']
  }
};

module.exports = [
  new Route(
    '/search',
    'GET',
    null,
    getSearchResultsSchema,
    searchHandlers.getSearchResultsHandler
  )
];
