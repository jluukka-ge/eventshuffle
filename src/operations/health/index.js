const _dbIsHealthy = async (persistentStorage) => {
  try {
    const isHealthy = await persistentStorage.checkHealth();
    return isHealthy;
  } catch(err) {
    console.error(err);
  }
  return false;
};

const define = ({ persistentStorage }) => {
  return async () => {
    const persistentStorageIsHealthy = await _dbIsHealthy(persistentStorage);

    return {
      persistentStorage: persistentStorageIsHealthy,
    };
  };
};

module.exports = {
  define,
};
