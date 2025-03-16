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

const _createEvent = async (db, eventName, dates) => {
  const newEvent = {
    _id: nextEventId(),
    name: eventName,
  };

  const newDates = dates.map((date) => {
    return {
      _id: nextDateId(),
      date: date,
      eventId: newEvent._id,
    };
  });

  db[EVENT_COLLECTION_NAME].push(newEvent);
  console.log(`Event entry added to DB: ${newEvent._id}`);

  newDates.forEach((dateObject) => {
    db[DATE_COLLECTION_NAME].push(dateObject);
    console.log(`Date entry added to DB: ${dateObject._id}`);
  });

  return newEvent;
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

const configureStorage = () => {
  const db = {
    [EVENT_COLLECTION_NAME]: [],
    [DATE_COLLECTION_NAME]: [],
    [VOTE_COLLECTION_NAME]: [],
  };

  return {
    createEvent: (eventName, dates) => _createEvent(db, eventName, dates),
    findEventById: (id) => _findEventById(db, id),
    close: () => {},
  };
};

module.exports = {
  configureStorage,
};
