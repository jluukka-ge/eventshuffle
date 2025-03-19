const { ObjectId } = require('bson');
const { configureMongoDB, collections } = require('./mongodb');

const _createEvent = async (dbOps, eventName) => {
  const newEvent = {
    name: eventName,
  };

  const eventUpsert = dbOps.upsert(collections.EVENT, newEvent);
  eventUpsert.then(() => {
    console.log(`Event entry added to DB: ${newEvent._id}`);
  });

  return eventUpsert;
};

const _createDate = (dbOps, eventId, date) => {
  const newDate = {
    date,
    eventId,
  };

  const dateUpsert = dbOps.upsert(collections.DATE, newDate);
  dateUpsert.then(() => {
    console.log(`Date entry added to DB: ${newDate._id}`);
  });

  return dateUpsert;
};

const _listEvents = async (dbOps) => {
  const resultArray = await dbOps.find(collections.EVENT);
  console.log(`Event entries found from DB (count ${resultArray.length})`);
  return resultArray;
};

const _findEventById = async (dbOps, id) => {
  const resultArray = await dbOps.find(collections.EVENT, { _id: new ObjectId(id) });

  if (resultArray.length > 0) {
    console.log(`Event entry found from DB with id: ${id}`);
    return resultArray[0];
  }

  console.log(`Event entry not found from DB with id: ${id}`);
  return null;
};

const _findDatesOfEvent = async (dbOps, eventId) => {
  const resultArray = await dbOps.find(collections.DATE, { eventId: { $eq: eventId } });
  console.log(`Found ${resultArray.length} date entries for event with ID ${eventId}`);
  return resultArray;
};

const _findVotesOfEvent = async (dbOps, eventId) => {
  const resultArray = await dbOps.find(collections.VOTE, { eventId: { $eq: eventId } });
  console.log(`Found ${resultArray.length} vote entries for event with ID ${eventId}`);
  return resultArray;
};

const _createVote = async (dbOps, eventId, voter, date) => {
  const newVote = {
    eventId,
    date,
    voter,
  };

  const voteUpsert = dbOps.upsert(collections.VOTE, newVote);
  voteUpsert.then(() => {
    console.log(`Vote entry added to DB: ${newVote._id}`);
  });

  return voteUpsert;
};


const defineStorage = (config) => {
  const dbOps = configureMongoDB(config);

  return {
    createEvent: (eventName) => _createEvent(dbOps, eventName),
    createDate: (eventId, date) => _createDate(dbOps, eventId, date),
    listEvents: () => _listEvents(dbOps),
    findEventById: (id) => _findEventById(dbOps, id),
    findDatesOfEvent: (eventId) => _findDatesOfEvent(dbOps, eventId),
    findVotesOfEvent: (eventId) => _findVotesOfEvent(dbOps, eventId),
    createVote: (eventId, voter, date) => _createVote(dbOps, eventId, voter, date),
    checkHealth: dbOps.checkHealth,
    close: dbOps.close,
    clear: dbOps.clear,
  };
};

module.exports = {
  defineStorage,
};
