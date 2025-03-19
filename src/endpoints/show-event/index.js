const {
  transformEvent,
  transformDate,
  transformVotes,
} = require('../utils');

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
