const define = ({ persistentStorage }) => {
  return async (eventId) => {
    const event = await persistentStorage.findEventById(eventId);

    if (!event) {
      return null;
    }

    const dates = await persistentStorage.findDatesOfEvent(eventId);

    const votes = await persistentStorage.findVotesOfEvent(eventId);

    return {
      event,
      dates,
      votes,
    };
  };
};

module.exports = {
  define,
};
