const express = require('express');
const bodyParser = require('body-parser');

const initApi = (config) => {
  const {
    testHandler,
  } = config;
  const app = express();

  // parse application/json
  app.use(bodyParser.json())

  app.get('/api/:apiVersion/event/list', (req, res) => {
    const apiVersion = req.params.apiVersion;
    const result = testHandler(apiVersion);
    res.json({ result });
  });

  return app;
};

module.exports = {
  initApi,
};
