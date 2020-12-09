'use strict';

const userRepo = require('../repositories/userRepo');
const Exception = require('../types/exception');
const {stripMetadata} = require('../utils/cosmosHelper');

const getSearchResultsHandler = async request => {
  const allUsers = await userRepo.getAll();
  const matchingResults = [];

  if (request.vparams.searchString.length >= 3) {
    allUsers.forEach(user => {
      const userFullName = `${user.firstName} ${user.lastName}`;
      if (
        userFullName
          .toLowerCase()
          .includes(request.vparams.searchString.toLowerCase())
      ) {
        matchingResults.push(JSON.parse(JSON.stringify(user)));
      } else if (
        user.email
          .toLowerCase()
          .includes(request.vparams.searchString.toLowerCase())
      ) {
        matchingResults.push(user);
      }
    });
  } else {
    throw new Exception(
      400,
      'Search string must contain at least 3 characters'
    );
  }

  if (request.vparams.userId) {
    const found = matchingResults.find(result => {
      return result.email === request.vparams.userId;
    });
    if (found) {
      matchingResults.splice(matchingResults.indexOf(found), 1);
    }
  }

  for (let r of matchingResults) {
    stripMetadata(r);
  }

  return {
    searchResults: matchingResults
  };
};

module.exports = {
  getSearchResultsHandler
};
