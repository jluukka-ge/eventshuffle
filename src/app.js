const { initApi } = require('./endpoints');
const { defineStorage } = require('./services/persistent-storage/mongodb');
const { defineStorage: defineMockStorage } = require('./services/persistent-storage/mock-storage');
const { defineService: defineParticipantService} = require('./services/participant-service');
const { define: defineOperations } = require('./operations');


const defineServices = (config) => {
  const {
    MOCK_DB = 'false',
    MONGODB_CONN_STR = '',
    MONGODB_DATABASE = '',
  } = config;

  const persistentStorage = MOCK_DB === 'false' ? (
    defineStorage({
      connectionString: MONGODB_CONN_STR,
      database: MONGODB_DATABASE,
    })
  ) : (
    defineMockStorage({})
  );

  const participantService = defineParticipantService();

  return {
    persistentStorage,
    participantService,
  };
};

const defineApp = (services) => {
  const {
    persistentStorage,
    participantService,
  } = services;

  const domainOperations = defineOperations({
    persistentStorage,
    participantService,
  });

  const app = initApi({
    domainOperations,
  });

  return app;
};

module.exports = {
  defineServices,
  defineApp,
};
