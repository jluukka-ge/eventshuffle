const {
  transformEvent,
  transformDate,
  transformVotes,
} = require('../utils');

const define = (app, listEvents) => {
  app.get('/api/v1/event/list', async (req, res) => {
    try {
      const events = await listEvents();

      return res.json({
        events: events.map(transformEvent),
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
