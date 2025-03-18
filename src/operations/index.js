const { define: defineHealth } = require('./health');
const { define: defineCreateEvent } = require('./create-event');
const { define: defineListEvents } = require('./list-event');
const { define: defineAddVotes } = require('./add-votes');

const define = (config) => {
  const {
    persistentStorage,
  } = config;

  return {
    health: defineHealth({ persistentStorage }),
    createEvent: defineCreateEvent({ persistentStorage }),
    listEvents: defineListEvents({ persistentStorage }),
    addVotes: defineAddVotes({ persistentStorage }),
  };
}
