/**
 * The specification did not inform us on what
 * "all participants" means in practice. There were no
 * indications about a set of participants or individual
 * members being added to an event.
 *
 * Following the advice of Kent Beck (from his TDD book),
 * we will make a simple implementation that will fulfill
 * the specification – until we receive more information
 * about the feature.
 *
 * The participant service in it's current form is a simple
 * service that will return the specified list of
 * participants to all events.
 */

const _getParticipantsForEvent = async (eventId) => {
  return [
    "John",
    "Julia",
    "Paul",
    "Daisy",
    "Dick",
  ];
};

const defineService = () => {
  return {
    getParticipantsForEvent: _getParticipantsForEvent,
  };
};

module.exports = {
  defineService,
};
