const { initApi } = require('./endpoints');

const MONGODB_CONN_STR = process.env.MONGODB_CONN_STR;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const PORT = process.env.PORT;

if (
  !MONGODB_CONN_STR ||
  !MONGODB_DATABASE ||
  !PORT
) {
  throw new Error('Invalid environment');
}

(async () => {
  const app = initApi({
    testHandler: (apiVersion) => apiVersion + '.0'
  });


  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  });
})();

console.log('Eventshuffle API started');
