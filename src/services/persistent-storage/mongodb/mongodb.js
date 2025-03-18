const { MongoClient } = require('mongodb');

const collections = {
  EVENT: 'event',
  DATE: 'date',
  VOTE: 'vote',
};

const replaceOne = async (
  collection,
  filter,
  data,
) => {
  const result = await collection.replaceOne(filter, data, { upsert: true });
  return {
    ...data,
    _id: result.upsertedId,
  };
}

const insertOne = async (
  collection,
  data,
) => {
  const result = await collection.insertOne(data);
  return {
    ...data,
    _id: result.insertedId,
  };
}

const upsertOne = async (
  collection,
  ...rest
) => {
  if (rest.length > 1) {
    const filter = rest[0];
    const data = rest[1];
    return replaceOne(collection, filter, data);
  }
  const data = rest[0];
  return insertOne(collection, data);
};


const configureMongoDB = (config) => {
  const {
    connectionString,
    database,
  } = config;

  const _client = new MongoClient(connectionString);
  const _database = _client.db(database);

  const upsert = async (
    collectionName,
    ...rest
  ) => {
    if (!collectionName) { return null; }

    const collection = _database.collection(collectionName);

    return upsertOne(collection, ...rest);
  };

  const find = async (
    collectionName,
    filter,
  ) => {
    if (!collectionName) { return null; }

    const collection = _database.collection(collectionName);

    return collection.find(filter).toArray();
  };

  const close = () => _client.close();

  const checkHealth = () => _database.stats().then(({ ok }) => ok === 1);

  const clear = async () => {
    const collections = await _database.listCollections().toArray();
    return collections.map(
      ({ name }) =>{
        return _database.collection(name).drop();
      }
    )
  };

  return {
    upsert,
    find,
    close,
    checkHealth,
    clear,
    db: _database,
  }
};

// ------- //

module.exports = {
  collections,

  configureMongoDB,
};
