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

const define = (app, addVotes) => {
  app.post('/api/v1/event/:eventId/vote', async (req, res) => {
    try {
      const { eventId } = req.params;
      const { name, votes } = req.body;

      const addVotesResult = await addVotes(eventId, name, votes);

      return res.json({
        ...transformEvent(addVotesResult.event),
        dates: addVotesResult.dates.map(transformDate),
        votes: transformVotes(
          addVotesResult.votes,
          addVotesResult.dates,
        ),
      });
    } catch(err) {
      console.error(err);
      return res.status(500).send();
    }
  });
};

module.exports = {
  define,
};
