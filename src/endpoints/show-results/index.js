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

const define = async (app, showResults) => {
  app.get('/api/v1/event/:eventId/results', async (req, res) => {
    try {
      const { eventId } = req.params;

      const result = await showResults(eventId);

      return res.json({
        ...transformEvent(result.event),
        suitableDates: transformVotes(
          result.votes,
          result.dates,
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
