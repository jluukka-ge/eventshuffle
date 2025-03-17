const { initApi } = require('./endpoints');
const { defineStorage } = require('./services/persistent-storage/mongodb');
const { defineStorage: defineMockStorage } = require('./services/persistent-storage/mock-storage');
const { define: defineOperations } = require('./operations');

const {
  MOCK_DB = 'false',
  MONGODB_CONN_STR = '',
  MONGODB_DATABASE = '',
  PORT = '3000',
} = process.env;

const persistentStorage = MOCK_DB === 'false' ? (
  defineStorage({
    connectionString: MONGODB_CONN_STR,
    database: MONGODB_DATABASE,
  })
) : (
  defineMockStorage({})
);

const domainOperations = defineOperations({
  persistentStorage,
});

const app = initApi({
  domainOperations,
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
