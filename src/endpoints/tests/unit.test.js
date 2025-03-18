/**
 * These tests are concerned only with how data from requests
 * is passed down to the domain logic functions and how return
 * values from domain logic is passed to the response object.
 *
 * There should be no domain-specific knowledge here, other than
 * the contract between API and clients which includes domain
 * data types.
 */

const { ObjectId } = require('bson');
const request = require('supertest');
const chai = import('chai');

const { initApi } = require('../index');

let expect;

describe('endpoints', () => {
  before(async () => {
    const _chai = await chai;
    expect = _chai.expect;
  });

  it('health domain operation is called', (done) => {
    const testHandler = (() => {
      let isCalled = false;
      const handler = (...rest) => {
        isCalled = true;
        return { persistentStorage: true };
      };
      const getIsCalled = () => isCalled;
      return {
        handler,
        getIsCalled,
      };
    })();

    const app = initApi({
      domainOperations: {
        health: testHandler.handler,
      }
    });

    request(app)
      .get('/api/v1/health')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        const isCalled = testHandler.getIsCalled();
        expect(isCalled).to.be.true;
        done();
      });
  });

  it('responds with event ID when creating an event', (done) => {
    const eventId = new ObjectId().toString();

    const _createEvent = (eventName, dates) => {
      return {
        _id: eventId,
        name: eventName,
      };
    };

    const app = initApi({
      domainOperations: {
        createEvent: _createEvent,
      }
    });

    request(app)
      .post('/api/v1/event')
      .send({
        "name": "Jake's secret party",
        "dates": [
          "2014-01-01",
          "2014-01-05",
          "2014-01-12"
        ]
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.deep.equal({ id: eventId });
        done();
      });
  });

  it('responds with a list of event IDs when listing events', (done) => {
    const events = [
      {
        "_id": new ObjectId().toString(),
        "name": "Jake's secret party"
      },
      {
        "_id": new ObjectId().toString(),
        "name": "Bowling night"
      },
      {
        "_id": new ObjectId().toString(),
        "name": "Tabletop gaming"
      }
    ];

    const _listEvents = (eventName, dates) => {
      return events;
    };

    const app = initApi({
      domainOperations: {
        listEvents: _listEvents,
      }
    });

    request(app)
      .get('/api/v1/event/list')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.deep.equal(
          events.map(({ _id: id, name }) => ({ id, name }))
        );
        done();
      });
  });

  it('passes vote parameters to domain operation correctly', (done) => {
    const voteData = {
      "name": "Dick",
      "votes": [
        "2014-01-01",
        "2014-01-05"
      ]
    };

    const eventId = 'event-010';

    let passedEventId, passedUserName, passedDates;
    const addVotes = (_eventId, _userName, _dates) => {
      passedEventId = _eventId;
      passedUserName = _userName;
      passedDates = _dates;

      return {
        event: {},
        dates: [],
        votes: [],
      }
    };

    const app = initApi({
      domainOperations: {
        addVotes,
      }
    });

    request(app)
      .post(`/api/v1/event/${eventId}/vote`)
      .send(voteData)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(passedEventId).to.equal('event-010');
        expect(passedUserName).to.equal('Dick');
        expect(passedDates).to.eql([
          "2014-01-01",
          "2014-01-05"
        ]);

        done();
      });
  });

  it('responds with a complete event data structure', (done) => {
    const voteData = {
      "name": "Dick",
      "votes": [
        "2014-01-01",
        "2014-01-05"
      ]
    };

    const eventId = 'event-010';

    const addVotes = () => {
      return {
        event: { _id: 0, name: "Jake's secret party" },
        dates: [
          { date: "2014-01-01", eventId: 0, _id: 0 },
          { date: "2014-01-05", eventId: 0, _id: 2 },
          { date: "2014-01-12", eventId: 0, _id: 3 },
        ],
        votes: [
          { voter: 'John', date: "2014-01-01", eventId: 0, _id: 0 },
          { voter: 'Julia', date: "2014-01-01", eventId: 0, _id: 1 },
          { voter: 'Paul', date: "2014-01-01", eventId: 0, _id: 2 },
          { voter: 'Daisy', date: "2014-01-01", eventId: 0, _id: 3 },
          { voter: 'Dick', date: "2014-01-01", eventId: 0, _id: 4 },
          { voter: 'Dick', date: "2014-01-05", eventId: 0, _id: 5 },
        ]
      };
    };

    const app = initApi({
      domainOperations: {
        addVotes,
      }
    });

    request(app)
      .post(`/api/v1/event/${eventId}/vote`)
      .send(voteData)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.body).to.eql(
          {
            "id": 0,
            "name": "Jake's secret party",
            "dates": [
              "2014-01-01",
              "2014-01-05",
              "2014-01-12"
            ],
            "votes": [
              {
                "date": "2014-01-01",
                "people": [
                  "John",
                  "Julia",
                  "Paul",
                  "Daisy",
                  "Dick"
                ]
              },
              {
                "date": "2014-01-05",
                "people": [
                  "Dick"
                ]
              }
            ]
          }
        );

        done();
      });
  });
});
