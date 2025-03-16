const { configureMongoDB, collections } = require('./mongodb');

const _createEvent = async (dbOps, eventName, dates) => {
  const newEvent = {
    name: eventName,
  };

  const dateObjects = await Promise.all(
    dates.map(async (date) => {
      return {
        date: date,
        eventId: newEvent._id,
      };
    })
  );

  const eventUpsert = dbOps.upsert(collections.EVENT, newEvent);
  eventUpsert.then(() => {
    console.log(`Event entry added to DB: ${newEvent._id}`);
  });

  const dateUpserts = dateObjects.map((newDate) => {
    const dateUpsert = dbOps.upsert(collections.DATE, newDate);
    dateUpsert.then(() => {
      console.log(`Date entry added to DB: ${newDate._id}`);
    });
    return dateUpsert;
  });

  return Promise.all([
    eventUpsert,
    ...dateUpserts,
  ]).then(() => newEvent);
};

const _findEventById = async (dbOps, id) => {
  const resultArray = await dbOps.find(collections.EVENT, { _id: { $eq: id } });

  if (resultArray.length > 0) {
    console.log(`Event entry found from DB with id: ${id}`);
    return resultArray[0];
  }

  console.log(`Event entry not found from DB with id: ${id}`);
  return null;
};

const configureStorage = (config) => {
  const dbOps = configureMongoDB(config);

  return {
    createEvent: (eventName, dates) => _createEvent(dbOps, eventName, dates),
    findEventById: (id) => _findEventById(dbOps, id),
    close: dbOps.close,
  };
};

module.exports = {
  configureStorage,
};
