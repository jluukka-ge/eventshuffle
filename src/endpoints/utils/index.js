const transformEvent = (event) => ({
  id: event._id,
  name: event.name,
});

const transformDate = (date) => date.date;

const transformVotes = (votes, dates) => {
  // Group by dates
  return dates
    .map(date => {
      const people = votes
        .filter(vote => vote.date === date.date)
        .map(vote => vote.voter);
      return {
        date: transformDate(date),
        people,
      };
    })
    .filter(({ people }) => people.length > 0);
};

module.exports = {
  transformEvent,
  transformDate,
  transformVotes,
};
