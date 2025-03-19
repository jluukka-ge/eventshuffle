const define = ({ persistentStorage }) => {
  return async (eventId, voter, votes) => {
    const event = await persistentStorage.findEventById(eventId);

    if (!event) {
      return null;
    }

    const dates = await persistentStorage.findDatesOfEvent(eventId);

    const newVotePromises = votes
      .filter(voteDate => dates.some(date => date.date === voteDate))
      .map(voteDate => {
        return persistentStorage.createVote(
          eventId,
          voter,
          voteDate,
        )
      });

    await Promise.all(newVotePromises);

    const allVotes = await persistentStorage.findVotesOfEvent(eventId);

    return {
      event,
      dates,
      votes: allVotes,
    };
  };
};

module.exports = {
  define,
};
