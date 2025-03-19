const {
  EVENT_NOT_FOUND_ERROR,

  transformEvent,
  transformDate,
  transformVotes,
} = require('../utils');

const define = async (app, showResults) => {
  app.get('/api/v1/event/:eventId/results', async (req, res) => {
    try {
      const { eventId } = req.params;

      const result = await showResults(eventId);

      if (result === null) {
        throw EVENT_NOT_FOUND_ERROR;
      }

      return res.json({
        ...transformEvent(result.event),
        suitableDates: transformVotes(
          result.votes,
          result.dates,
        ),
      });
    } catch(err) {
      switch (err) {
        case EVENT_NOT_FOUND_ERROR:
          return res.status(404).send('Event not found');
        default:
          console.error(err);
          return res.status(500).send();
      }
    }
  });
};

module.exports = {
  define,
};
