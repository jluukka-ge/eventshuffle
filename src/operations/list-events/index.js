const define = ({ persistentStorage }) => {
  return async () => {
    const events = await persistentStorage.listEvents();

    return events;
  };
};

module.exports = {
  define,
};
