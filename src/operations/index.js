const { define: defineHealth } = require('./health');
const { define: defineCreateEvent } = require('./create-event');
const { define: defineListEvents } = require('./list-events');
const { define: defineAddVotes } = require('./add-votes');
const { define: defineShowEvent } = require('./show-event');
const { define: defineShowResults } = require('./show-results');

const define = (config) => {
  const {
    persistentStorage,
    participantService,
  } = config;

  const health = defineHealth({ persistentStorage });
  const createEvent = defineCreateEvent({ persistentStorage });
  const listEvents = defineListEvents({ persistentStorage });
  const addVotes = defineAddVotes({ persistentStorage });
  const showEvent = defineShowEvent({ persistentStorage });
  const showResults = defineShowResults({ persistentStorage, participantService, showEvent });

  return {
    health,
    createEvent,
    listEvents,
    addVotes,
    showEvent,
    showResults,
  };
}

module.exports = {
  define,
}
