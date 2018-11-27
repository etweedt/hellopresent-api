'use strict';

const healthCheckHandler = async () => {
  // Add api/db connection checks here and return amIHealthy accordingly

  return {
    amIHealthy: true
  };
};

module.exports = {
  healthCheckHandler
};
