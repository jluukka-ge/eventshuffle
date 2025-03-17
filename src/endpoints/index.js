const express = require('express');
const bodyParser = require('body-parser');

const health = require('./health');

const initApi = (config) => {
  const {
    domainOperations,
  } = config;

  const app = express();

  // parse application/json
  app.use(bodyParser.json())

  health.define(app, domainOperations.health);

  return app;
};

module.exports = {
  initApi,
};
