const { define: defineHealth } = require('./health');
const { define: defineCreateEvent } = require('./create-event');

const define = (config) => {
  const {
    persistentStorage,
  } = config;

  return {
    health: defineHealth({ persistentStorage }),
    createEvent: defineCreateEvent({ persistentStorage }),
  };
}
