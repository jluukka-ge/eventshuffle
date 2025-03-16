/**
 * These tests are concerned only with how data from requests
 * is passed down to the domain logic functions and how return
 * values from domain logic is passed to the response object.
 *
 * There should be no domain-specific knowledge here, other than
 * the contract between API and clients which includes domain
 * data types.
 */

const request = require('supertest');
const chai = import('chai');

const { initApi } = require('../index');

let expect;

describe('endpoints', () => {
  before(async () => {
    const _chai = await chai;
    expect = _chai.expect;
  });

  it('calls test handler correctly', (done) => {
    const PORT = 3000;

    const testHandler = (() => {
      let params;
      const handler = (...rest) => { params = rest; };
      const getParams = () => params;
      return {
        handler,
        getParams,
      };
    })();

    const app = initApi({
      PORT,
      testHandler: testHandler.handler,
    });

    request(app)
      .get('/api/v1/event/list')
      .end((err, res) => {
        if (err) {
          app.
          done(err);
        }
        const params = testHandler.getParams();
        expect(params).to.have.lengthOf(1);
        expect(params[0]).to.equal('v1');
        done();
      });
  });
});
