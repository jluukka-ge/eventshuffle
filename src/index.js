const { configureMongoDB } = require('./services/persistent-storage/mongodb');

const MONGODB_CONN_STR = process.env.MONGODB_CONN_STR;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

if (
  !MONGODB_CONN_STR ||
  !MONGODB_DATABASE
) {
  throw new Error('Invalid environment');
}

(async () => {
  const db = configureMongoDB({
    connectionString: MONGODB_CONN_STR,
    database: MONGODB_DATABASE,
  });

  const upsertResult = await db.upsert('test-collection', { value: { $eq: 1 } }, { value: 1, payload: 'abc' });
  const fetchedData = await db.find('test-collection', { value: { $eq: 1 } });

  console.log(`fetchedData payload: ${JSON.stringify(fetchedData)}`);
})();

console.log('Eventshuffle API started');
