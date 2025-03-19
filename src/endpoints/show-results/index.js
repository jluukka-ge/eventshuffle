const {
  transformEvent,
  transformDate,
  transformVotes,
} = require('../utils');

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
