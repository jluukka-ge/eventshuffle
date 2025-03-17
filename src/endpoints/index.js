const express = require('express');
const bodyParser = require('body-parser');

const health = require('./health');
const createEvent = require('./create-event');

const initApi = (config) => {
  const {
    domainOperations,
  } = config;

  const app = express();

  // parse application/json
  app.use(bodyParser.json())

  health.define(app, domainOperations.health);
  createEvent.define(app, domainOperations.createEvent);

  return app;
};

module.exports = {
  initApi,
};
