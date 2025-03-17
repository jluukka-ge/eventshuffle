const { define: defineHealth } = require('./health');

const define = (config) => {
  const {
    persistentStorage,
  } = config;

  return {
    health: defineHealth({ persistentStorage }),
  };
}
