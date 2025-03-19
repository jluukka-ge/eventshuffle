
const { ObjectId } = require('bson');
const request = require('supertest');
const chai = import('chai');

const { defineStorage: defineMockStorage } = require('../src/services/persistent-storage/mock-storage');
const { defineService: defineParticipantService} = require('../src/services/participant-service');

const { defineApp } = require('../src/app');

let expect;

const getNewApp = () => {
  const storage = defineMockStorage();
  const app = defineApp({
    persistentStorage: storage,
    participantService: defineParticipantService(),
  });
  return {
    app,
    storage,
  }
};

describe('high level specifications', () => {
  before(async () => {
    const _chai = await chai;
    expect = _chai.expect;
  });


  it('lists all events', async () => {
    const { app, storage } = getNewApp();
    await storage.createEvent("Jake's secret party");
    await storage.createEvent("Bowling night");
    await storage.createEvent("Tabletop gaming");

    const response = await request(app)
      .get("/api/v1/event/list")

    expect(response.body.events).to.have.lengthOf(3);

    const eventNames = response.body.events.map(({ name }) => name);

    expect(eventNames).to.have.members(["Jake's secret party", "Bowling night", "Tabletop gaming"]);
  });

  it('creates an event', async () => {
    const { app, storage } = getNewApp();
    await storage.createEvent("Bowling night");
    await storage.createEvent("Tabletop gaming");

    const response = await request(app)
      .post("/api/v1/event")
      .send({
        "name": "Jake's secret party",
        "dates": [
          "2014-01-01",
          "2014-01-05",
          "2014-01-12"
        ]
      })

    expect(response.body).to.have.keys('id');
  });

  it('shows an event', async () => {
    const { app, storage } = getNewApp();
    const jakesEvent = await storage.createEvent("Jake's secret party");
    await storage.createEvent("Bowling night");
    await storage.createEvent("Tabletop gaming");

    await storage.createDate(jakesEvent._id, "2014-01-01");
    await storage.createDate(jakesEvent._id, "2014-01-05");
    await storage.createDate(jakesEvent._id, "2014-01-12");

    await storage.createVote(jakesEvent._id, "John", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Julia", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Paul", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Daisy", "2014-01-01");

    const response = await request(app)
      .get(`/api/v1/event/${jakesEvent._id}`)

    expect(response.body.id).to.equal(jakesEvent._id);
    expect(response.body.name).to.equal("Jake's secret party");

    expect(response.body.dates).to.have.lengthOf(3);
    expect(response.body.dates).to.have.members([
      "2014-01-01",
      "2014-01-05",
      "2014-01-12",
    ]);

    expect(response.body.votes).to.have.lengthOf(1);
    expect(response.body.votes[0].date).to.equal("2014-01-01");
    expect(response.body.votes[0].people).to.have.lengthOf(4);
    expect(response.body.votes[0].people).to.have.members([
      "John",
      "Julia",
      "Paul",
      "Daisy",
    ]);
  });

  it('adds votes to an event', async () => {
    const { app, storage } = getNewApp();
    const jakesEvent = await storage.createEvent("Jake's secret party");

    await storage.createDate(jakesEvent._id, "2014-01-01");
    await storage.createDate(jakesEvent._id, "2014-01-05");
    await storage.createDate(jakesEvent._id, "2014-01-12");

    await storage.createVote(jakesEvent._id, "John", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Julia", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Paul", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Daisy", "2014-01-01");

    const response = await request(app)
      .post(`/api/v1/event/${jakesEvent._id}/vote`)
      .send({
        "name": "Dick",
        "votes": [
          "2014-01-01",
          "2014-01-05"
        ]
      })

    expect(response.body.id).to.equal(jakesEvent._id);
    expect(response.body.name).to.equal("Jake's secret party");

    expect(response.body.dates).to.have.lengthOf(3);
    expect(response.body.dates).to.have.members([
      "2014-01-01",
      "2014-01-05",
      "2014-01-12",
    ]);

    expect(response.body.votes).to.have.lengthOf(2);
    expect(response.body.votes[0].date).to.equal("2014-01-01");
    expect(response.body.votes[0].people).to.have.lengthOf(5);
    expect(response.body.votes[0].people).to.have.members([
      "John",
      "Julia",
      "Paul",
      "Daisy",
      "Dick"
    ]);
    expect(response.body.votes[1].date).to.equal("2014-01-05");
    expect(response.body.votes[1].people).to.have.lengthOf(1);
    expect(response.body.votes[1].people).to.have.members([
      "Dick"
    ]);
  });

  it('shows the results of an event', async () => {
    const { app, storage } = getNewApp();
    const jakesEvent = await storage.createEvent("Jake's secret party");

    await storage.createDate(jakesEvent._id, "2014-01-01");
    await storage.createDate(jakesEvent._id, "2014-01-05");
    await storage.createDate(jakesEvent._id, "2014-01-12");

    await storage.createVote(jakesEvent._id, "John", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Julia", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Paul", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Daisy", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Dick", "2014-01-01");
    await storage.createVote(jakesEvent._id, "Dick", "2014-01-05");

    const response = await request(app)
      .get(`/api/v1/event/${jakesEvent._id}/results`)

    expect(response.body.id).to.equal(jakesEvent._id);
    expect(response.body.name).to.equal("Jake's secret party");

    expect(response.body.suitableDates).to.have.lengthOf(1);
    expect(response.body.suitableDates[0].date).to.equal("2014-01-01");
    expect(response.body.suitableDates[0].people).to.have.lengthOf(5);
    expect(response.body.suitableDates[0].people).to.have.members([
      "John",
      "Julia",
      "Paul",
      "Daisy",
      "Dick",
    ]);
  });

});
