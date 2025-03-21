const {
  EVENT_NOT_FOUND_ERROR,

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

      if (addVotesResult === null) {
        throw EVENT_NOT_FOUND_ERROR;
      }

      return res.json({
        ...transformEvent(addVotesResult.event),
        dates: addVotesResult.dates.map(transformDate),
        votes: transformVotes(
          addVotesResult.votes,
          addVotesResult.dates,
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
