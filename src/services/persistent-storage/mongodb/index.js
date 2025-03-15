const { MongoClient } = require('mongodb');


const replaceOne = async (
  collection,
  filter,
  replacement,
) => {
  const result = await collection.replaceOne(filter, replacement, { upsert: true });
  return {
    ...result,
    documentId: result.upsertedId,
  };
}

const insertOne = async (
  collection,
  document,
) => {
  const result = await collection.insertOne(document);
  return {
    ...result,
    documentId: result.insertedId,
  };
}

const upsertOne = async (
  collection,
  ...rest
) => {
  if (rest.length > 1) {
    const filter = rest[0];
    const replacement = rest[1];
    return replaceOne(collection, filter, replacement);
  }
  const replacement = rest[0];
  return insertOne(collection, replacement);
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

  const close = () => {};

  return {
    upsert,
    close,
    find,
    db: _database,
  }
};

// ------- //

module.exports = {
  configureMongoDB,
};
