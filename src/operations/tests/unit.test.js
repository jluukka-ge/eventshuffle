/**
 * Domain operations have very little (in this project none)
 * dependencies that have side-effects. Since external services
 * have been provided a parameter, it is easy to provide mock
 * implementations in unit tests. Just keep the interface of
 * such dependencies simple enough to make mocking easy.
 *
 */

describe('operations', () => {
  it('calls health check correctly');
  it('creates an event correctly');
});
