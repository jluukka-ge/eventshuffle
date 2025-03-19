const define = ({ persistentStorage }) => {
  return async (eventName, dates) => {
    const newEvent = await persistentStorage.createEvent(eventName);

    const newDates = dates.map(date => {
      return persistentStorage.createDate(newEvent._id.toString(), date)
    });

    return Promise.all([
      newEvent,
      ...newDates,
    ]).then(() => newEvent);
  };
};

module.exports = {
  define,
};
