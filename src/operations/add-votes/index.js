const define = ({ persistentStorage }) => {
  return async (eventId, voter, votes) => {
    const event = await persistentStorage.findEventById(eventId);

    if (!event) {
      throw new Exception({ status: 404, message: 'Event not found' });
    }

    const dates = await persistentStorage.findDatesOfEvent(eventId);

    const newVotes = votes
      .filter(voteDate => dates.some(date => date.date === voteDate))
      .map(voteDate => {
        return persistentStorage.createVote(
          eventId,
          voter,
          voteDate,
        )
      });

    return Promise.all([
      ...newVotes,
    ]).then((newVoteResults) => {
      return {
        event,
        dates,
        votes: newVoteResults,
      };
    });
  };
};

module.exports = {
  define,
};
