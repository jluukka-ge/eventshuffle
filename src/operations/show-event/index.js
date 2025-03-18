const define = ({ persistentStorage }) => {
  return async (eventId) => {
    const event = await persistentStorage.findEventById(eventId);

    if (!event) {
      throw new Error({ status: 404, message: 'Event not found' });
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
