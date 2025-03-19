/**
 * Domain operations have very little (in this project none)
 * dependencies that have side-effects. Since external services
 * have been provided a parameter, it is easy to provide mock
 * implementations in unit tests. Just keep the interface of
 * such dependencies simple enough to make mocking easy.
 *
 */

const { ObjectId } = require('bson');
const chai = import('chai');

const { define: defineCreateEvent } = require('../create-event');
const { define: defineAddVotes } = require('../add-votes');
const { define: defineShowEvent } = require('../show-event');
const { define: defineShowResults } = require('../show-results');

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

  it("returns the event, event's dates and votes from add votes -operation", (done) => {
    const addVotes = defineAddVotes({
      persistentStorage: {
        findEventById: async (eventId) => {
          return {
            _id: 'e:010',
            name: 'event-010'
          };
        },
        findDatesOfEvent: async (eventId) => {
          return [
            { eventId: 'e:010', date: '2025-03-17', _id: 'd:001' },
            { eventId: 'e:010', date: '2025-03-18', _id: 'd:002' },
          ];
        },
        createVote: async (eventId, voter, date) => {
          return {
            _id: 'v:000',
            eventId,
            date,
            voter,
          };
        },
      }
    });

    addVotes(
      'e:010',
      'Richard',
      ['2025-03-17', '2025-03-18']
    ).then(result => {

      expect(result.event).to.eql({
        _id: 'e:010',
        name: 'event-010'
      });

      expect(result.dates).to.eql([
        { eventId: 'e:010', date: '2025-03-17', _id: 'd:001' },
        { eventId: 'e:010', date: '2025-03-18', _id: 'd:002' },
      ]);

      expect(result.votes).to.eql([
        { eventId: 'e:010', date: '2025-03-17', _id: 'v:000', voter: 'Richard' },
        { eventId: 'e:010', date: '2025-03-18', _id: 'v:000', voter: 'Richard' },
      ]);

      done();
    }).catch(done);
  });

  it("returns the event, event's dates and votes from show event -operation");
  it("returns the event, event's dates and votes filtered by suitability from show results -operation", async () => {
    const persistentStorage = {
      findEventById: async () => {
        return { _id: 0, name: 'event-010' };
      },
      findDatesOfEvent: async () => {
        return [
          { _id: 0, eventId: 0, date: '2025-03-17' },
          { _id: 1, eventId: 0, date: '2025-03-18' },
          { _id: 2, eventId: 0, date: '2025-03-19' },
        ]
      },
      findVotesOfEvent: async () => {
        return [
          { _id: 0, eventId: 0, date: '2025-03-17', voter: 'A' },
          { _id: 1, eventId: 0, date: '2025-03-17', voter: 'B' },
          { _id: 2, eventId: 0, date: '2025-03-17', voter: 'C' },
          { _id: 3, eventId: 0, date: '2025-03-18', voter: 'C' },
          { _id: 4, eventId: 0, date: '2025-03-19', voter: 'C' },
        ]
      },
    };

    const participantService = {
      getParticipantsForEvent: () => ['A', 'B', 'C'],
    };

    const showEvent = defineShowEvent({ persistentStorage });

    const showResults = defineShowResults({ persistentStorage, participantService, showEvent });

    const result = await showResults(0);

    expect(result.event._id).to.equal(0);
    expect(result.event.name).to.equal('event-010');

    expect(result.dates).to.have.lengthOf(1);
    expect(result.dates[0].date).to.equal('2025-03-17');

    expect(result.votes).to.have.lengthOf(3);
    expect(result.votes.map(({voter}) => voter)).to.have.members(['A', 'B', 'C']);
    result.votes.map(({date}) => date).forEach(
      (date) => {
        expect(date).to.equal('2025-03-17');
      }
    );

  });

});
