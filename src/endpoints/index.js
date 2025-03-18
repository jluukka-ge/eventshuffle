const express = require('express');
const bodyParser = require('body-parser');

const health = require('./health');
const createEvent = require('./create-event');
const listEvents = require('./list-events');
const addVotes = require('./add-votes');

const initApi = (config) => {
  const {
    domainOperations,
  } = config;

  const app = express();

  // parse application/json
  app.use(bodyParser.json())

  health.define(app, domainOperations.health);
  createEvent.define(app, domainOperations.createEvent);
  listEvents.define(app, domainOperations.listEvents);
  addVotes.define(app, domainOperations.addVotes);

  return app;
};

module.exports = {
  initApi,
};
