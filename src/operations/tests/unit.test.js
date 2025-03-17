/**
 * Domain operations have very little (in this project none)
 * dependencies that have side-effects. Since external services
 * have been provided a parameter, it is easy to provide mock
 * implementations in unit tests. Just keep the interface of
 * such dependencies simple enough to make mocking easy.
 *
 */

const { ObjectId } = require('bson');
const request = require('supertest');
const chai = import('chai');

const { define: defineCreateEvent } = require('../create-event');

let expect;

describe('operations', () => {
  before(async () => {
    const _chai = await chai;
    expect = _chai.expect;
  });

  it('calls health check correctly');
  it('lists events correctly');

  it('creates an event with dates correctly', (done) => {
    const events = [];
    const dates = [];

    const createEvent = defineCreateEvent({
      persistentStorage: {
        createEvent: (name) => {
          const event = { name, _id: new ObjectId().toString() };
          events.push(event);
          return event;
        },
        createDate: (eventId, date) => {
          const newDate = { eventId, date, _id: new ObjectId().toString() };
          dates.push(newDate);
          return newDate;
        },
      }
    });

    createEvent('newEvent', ['2025-03-17', '2025-03-17']).then(
      (newEvent) => {
        expect(dates).to.have.lengthOf(2);
        dates.forEach(date => {
          expect(date.eventId).to.equal(newEvent._id);
        });

        done();
      }
    ).catch(done);
  });
});
