const { ObjectId } = require('bson');

const EVENT_COLLECTION_NAME = 'events';
const DATE_COLLECTION_NAME = 'dates';
const VOTE_COLLECTION_NAME = 'votes';

const autoIncrementNextId = (() => {
  let id = 0;
  return () => id++;
});

const objectIdNextId = () => () => new ObjectId();

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
  console.log(`Date entry added to DB: ${dateObject._id}`);

  return newDate;
};

const _listEvents = async (db) => {
  return db[EVENT_COLLECTION_NAME];
};

const _findEventById = async (db, id) => {
  const event = db[EVENT_COLLECTION_NAME].find((event) => event._id === id);

  if (!!event) {
    console.log(`Event entry found from DB with id: ${event._id}`);
    return event;
  }

  console.log(`Event entry not found from DB with id: ${event._id}`);
  return null;
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
    clear: () => _clear(db),
    close,
    checkHealth,
  };
};

module.exports = {
  defineStorage,
};
