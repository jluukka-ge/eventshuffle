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

const define = (app, showEvent) => {
  app.get('/api/v1/event/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;

      const showEventResult = await showEvent(eventId);

      return res.json({
        ...transformEvent(showEventResult.event),
        dates: showEventResult.dates.map(transformDate),
        votes: transformVotes(
          showEventResult.votes,
          showEventResult.dates,
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
