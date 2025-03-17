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
        eventName,
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
});
