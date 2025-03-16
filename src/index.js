const { configureStorage: mongoStorage } = require('./services/persistent-storage/mongodb');
const { configureStorage: mockStorage } = require('./services/persistent-storage/mock-storage');

const MONGODB_CONN_STR = process.env.MONGODB_CONN_STR;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

if (
  !MONGODB_CONN_STR ||
  !MONGODB_DATABASE
) {
  throw new Error('Invalid environment');
}

(async () => {
  const mongoOps = mongoStorage({
    connectionString: MONGODB_CONN_STR,
    database: MONGODB_DATABASE,
  });

  const createdA = await mongoOps.createEvent('event A', ['2025-03-10', '2025-03-11']);
  const createdB = await mongoOps.createEvent('event B', ['2025-03-10', '2025-03-11']);

  const fetchedA = await mongoOps.findEventById(createdA._id);
  const fetchedB = await mongoOps.findEventById(createdB._id);

  console.log(`fetchedData payload A: ${JSON.stringify(fetchedA)}`);
  console.log(`fetchedData payload B: ${JSON.stringify(fetchedB)}`);

  const mockOps = mockStorage();

  const createdAmock = await mockOps.createEvent('event A', ['2025-03-10', '2025-03-11']);
  const createdBmock = await mockOps.createEvent('event B', ['2025-03-10', '2025-03-11']);

  const fetchedAmock = await mockOps.findEventById(createdAmock._id);
  const fetchedBmock = await mockOps.findEventById(createdBmock._id);

  console.log(`fetchedData payload A: ${JSON.stringify(fetchedAmock)}`);
  console.log(`fetchedData payload B: ${JSON.stringify(fetchedBmock)}`);

})();

console.log('Eventshuffle API started');
