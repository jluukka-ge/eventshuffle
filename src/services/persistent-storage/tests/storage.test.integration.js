/**
 * These tests ensure that the mock storage API works like an
 * actual DB connection. When this holds true, we can write
 * unit tests for the rest of the application based on the
 * assumption that if tests pass using the mock storage, they
 * should pass with an actual DB.
 *
 * TODO:
 * - Set up a separate test DB -- no testing in production DB!
 * - Write a script that will set up the integration testing
 *   environment (Docker up and down, read env vars, run tests etc.)
 */

const chai = import('chai');

const { defineStorage: mongoStorage } = require('../mongodb');
const { defineStorage: mockStorage } = require('../mock-storage');

const MONGODB_CONN_STR=`mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@localhost`;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

if (
  !MONGODB_CONN_STR ||
  !MONGODB_DATABASE
) {
  throw new Error('Invalid environment');
}

let mongoOps;
let expect;


describe('Persistent storage', () => {
  before(async () => {
    mongoOps = mongoStorage({
      connectionString: MONGODB_CONN_STR,
      database: MONGODB_DATABASE,
    });

    const _chai = await chai;
    expect = _chai.expect;
  });

  after(async () => {
    await mongoOps.close();
  });

  describe('Mock implementation matches MongoDB API', () => {
    it('creates event objects with common structure', async () => {
      const mockOps = mockStorage();

      const createdMongo = await mongoOps.createEvent('event mongo', ['2025-03-10', '2025-03-11']);
      const createdMock = await mockOps.createEvent('event mock', ['2025-03-10', '2025-03-11']);

      // Test both objects
      [
        createdMongo,
        createdMock,
      ].forEach((createdObject) => {
        expect(createdObject).to.have.property('_id');
        expect(createdObject).to.have.property('name');
      });
    });

    it('returns event objects with common structure', async () => {
      const mockOps = mockStorage();

      const createdMongo = await mongoOps.createEvent('event mongo', ['2025-03-10', '2025-03-11']);
      const createdMock = await mockOps.createEvent('event mock', ['2025-03-10', '2025-03-11']);

      const fetchedMongo = await mongoOps.findEventById(createdMongo._id);
      const fetchedMock = await mockOps.findEventById(createdMock._id);

      // Test both objects
      [
        fetchedMongo,
        fetchedMock,
      ].forEach((fetchedObject) => {
        expect(fetchedObject).to.have.property('_id');
        expect(fetchedObject).to.have.property('name');
      });
    });
  });
});
