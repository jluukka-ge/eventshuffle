const { ObjectId } = require('bson');

const EVENT_COLLECTION_NAME = 'events';
const DATE_COLLECTION_NAME = 'dates';
const VOTE_COLLECTION_NAME = 'votes';

const autoIncrementNextId = (() => {
  let id = 0;
  return () => id++;
});

const objectIdNextId = () => () => new ObjectId().toString();

const nextEventId = objectIdNextId();
const nextDateId = objectIdNextId();
const nextVoteId = objectIdNextId();

const _createEvent = async (db, eventName) => {
  const newEvent = {
    _id: nextEventId(),
    name: eventName,
  };

  db[EVENT_COLLECTION_NAME].push(newEvent);
  console.log(`Event entry added to DB: ${newEvent._id}`);

  return newEvent;
};

const _createDate = async (db, eventId, date) => {
  const newDate = {
    _id: nextDateId(),
    date: date,
    eventId: eventId,
  };

  db[DATE_COLLECTION_NAME].push(newDate);
  console.log(`Date entry added to DB: ${newDate._id}`);

  return newDate;
};

const _listEvents = async (db) => {
  return db[EVENT_COLLECTION_NAME];
};

const _findEventById = async (db, id) => {
  const event = db[EVENT_COLLECTION_NAME].find((event) => event._id === id);

  if (!!event) {
    console.log(`Event entry found from DB with id: ${id}`);
    return event;
  }

  console.log(`Event entry not found from DB with id: ${id}`);
  return null;
};

const _findDatesOfEvent = async (db, eventId) => {
  const dates = db[DATE_COLLECTION_NAME].filter((date) => date.eventId === eventId);

  console.log(`Found ${dates.length} date entries for event with ID ${eventId}`);

  return dates;
};

const _findVotesOfEvent = async (db, eventId) => {
  const votes = db[VOTE_COLLECTION_NAME].filter((vote) => vote.eventId === eventId);

  console.log(`Found ${votes.length} vote entries for event with ID ${eventId}`);

  return votes;
};

const _createVote = async (db, eventId, voter, date) => {
  const newVote = {
    _id: nextVoteId(),
    eventId,
    date,
    voter,
  };

  db[VOTE_COLLECTION_NAME].push(newVote);
  console.log(`Vote entry added to DB: ${newVote._id}`);

  return newVote;
};


const _clear = async (db) => {
  db[EVENT_COLLECTION_NAME] = [];
  db[DATE_COLLECTION_NAME] = [];
  db[VOTE_COLLECTION_NAME] = [];
};

const defineStorage = (config = {}) => {
  const {
    close = () => {},
    checkHealth = () => Future.resolve(true),
  } = config;

  const db = {
    [EVENT_COLLECTION_NAME]: [],
    [DATE_COLLECTION_NAME]: [],
    [VOTE_COLLECTION_NAME]: [],
  };

  return {
    createEvent: (eventName) => _createEvent(db, eventName),
    createDate: (eventId, date) => _createDate(db, eventId, date),
    listEvents: () => _listEvents(db),
    findEventById: (id) => _findEventById(db, id),
    findDatesOfEvent: (eventId) => _findDatesOfEvent(db, eventId),
    findVotesOfEvent: (eventId) => _findVotesOfEvent(db, eventId),
    createVote: (eventId, voter, date) => _createVote(db, eventId, voter, date),
    clear: () => _clear(db),
    close,
    checkHealth,
  };
};

module.exports = {
  defineStorage,
};
