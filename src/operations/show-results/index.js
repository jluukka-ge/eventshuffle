const voteEntryMatches = (voter, date) => entry => {
  return entry.voter === voter && entry.date === date;
}

const participantHasVotedForDate = (votes, date) => participant => {
  return votes.some(voteEntryMatches(participant, date));
};

const define = ({
  persistentStorage,
  participantService,
  showEvent,
}) => {
  return async (eventId) => {
    const eventWithVotes = await showEvent(eventId);

    if (!eventWithVotes) {
      return null;
    }

    const participants = await participantService.getParticipantsForEvent(eventId);

    const suitableDates = eventWithVotes.dates.filter(
      ({ date }) => {
        return participants.every(
          participantHasVotedForDate(eventWithVotes.votes, date)
        );
      }
    );

    const suitableDateVotes = eventWithVotes.votes.filter(
      ({ date: voteDate }) => suitableDates.some(({ date }) => date === voteDate)
    );

    return {
      event: eventWithVotes.event,
      dates: suitableDates,
      votes: suitableDateVotes,
    };
  };
};

module.exports = {
  define,
};
