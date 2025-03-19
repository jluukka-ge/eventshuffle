const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const health = require('./health');
const createEvent = require('./create-event');
const listEvents = require('./list-events');
const addVotes = require('./add-votes');
const showEvent = require('./show-event');
const showResults = require('./show-results');

const initApi = (config) => {
  const {
    domainOperations,
  } = config;

  const app = express();
  app.use(helmet());

  // parse application/json
  app.use(bodyParser.json())

  health.define(app, domainOperations.health);
  createEvent.define(app, domainOperations.createEvent);
  listEvents.define(app, domainOperations.listEvents);
  addVotes.define(app, domainOperations.addVotes);
  showEvent.define(app, domainOperations.showEvent);
  showResults.define(app, domainOperations.showResults);

  return app;
};

module.exports = {
  initApi,
};
