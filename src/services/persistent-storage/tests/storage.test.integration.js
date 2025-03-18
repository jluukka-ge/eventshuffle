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
console.log(MONGODB_DATABASE);
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

  afterEach(async () => {
    await mongoOps.clear();
  });

  describe('Mock implementation matches MongoDB API', () => {
    it('creates event objects with common structure', async () => {
      const mockOps = mockStorage();

      const createdMongo = await mongoOps.createEvent('event mongo');
      const createdMock = await mockOps.createEvent('event mock');

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

    it('lists events with a common interface', async () => {
      const mockOps = mockStorage();

      const createdMongoA = await mongoOps.createEvent('event mongo A', ['2025-03-10', '2025-03-11']);
      const createdMongoB = await mongoOps.createEvent('event mongo B', ['2025-03-10', '2025-03-11']);

      const createdMockA = await mockOps.createEvent('event mock A', ['2025-03-10', '2025-03-11']);
      const createdMockB = await mockOps.createEvent('event mock B', ['2025-03-10', '2025-03-11']);

      const listedMongo = await mongoOps.listEvents();
      const listedMock = await mockOps.listEvents();

      // Test both objects
      [
        listedMongo,
        listedMock,
      ].forEach((eventList) => {
        expect(eventList).to.have.lengthOf(2);
        eventList.forEach((event) => {
          expect(event).to.have.property('_id');
        });
      });
    });

    it('finds dates of an event with a common interface', async () => {
      const mockOps = mockStorage();

      const createdEventMongo = await mongoOps.createEvent('event mongo');
      const createdEventMock = await mockOps.createEvent('event mock');

      const createdDateMongoA = await mongoOps.createDate(createdEventMongo._id, '2025-03-17');
      const createdDateMongoB = await mongoOps.createDate(createdEventMongo._id, '2025-03-18');

      const createdDateMockA = await mockOps.createDate(createdEventMock._id, '2025-03-17');
      const createdDateMockB = await mockOps.createDate(createdEventMock._id, '2025-03-18');

      const resultsMongo = await mongoOps.findDatesOfEvent(createdEventMongo._id);
      const resultsMock = await mockOps.findDatesOfEvent(createdEventMock._id);

      [
        resultsMongo,
        resultsMock,
      ].forEach((results) => {
        expect(results).to.have.lengthOf(2);
        expect(results[0].date).to.equal('2025-03-17');
        expect(results[1].date).to.equal('2025-03-18');
      });
    });

    it('creates a date with a common interface', async () => {
      const mockOps = mockStorage();

      const createdMongo = await mongoOps.createDate('e:01', '2025-07-17');
      const createdMock = await mockOps.createDate('e:01', '2025-07-17');

      // Test both objects
      [
        createdMongo,
        createdMock,
      ].forEach((createdObject) => {
        expect(createdObject).to.have.property('_id');
        expect(createdObject).to.have.property('eventId');
        expect(createdObject).to.have.property('date');
      });
    });

    it('creates a vote with a common interface', async () => {
      const mockOps = mockStorage();

      const createdMongo = await mongoOps.createVote('e:01', 'Richard', '2025-07-17');
      const createdMock = await mockOps.createVote('e:01', 'Richard', '2025-07-17');

      // Test both objects
      [
        createdMongo,
        createdMock,
      ].forEach((createdObject) => {
        expect(createdObject).to.have.property('_id');
        expect(createdObject).to.have.property('eventId');
        expect(createdObject).to.have.property('date');
        expect(createdObject).to.have.property('voter');
      });
    });

  });
});
