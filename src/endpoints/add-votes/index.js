const {
  transformEvent,
  transformDate,
  transformVotes,
} = require('../utils');


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
