const define = ({ persistentStorage }) => {
  return async (eventName, dates) => {
    const newEvent = await persistentStorage.createEvent(eventName, dates);

    return newEvent;
  };
};

module.exports = {
  define,
};
