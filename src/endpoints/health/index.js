const define = (app, checkHealth) => {
  app.get('/api/v1/health', async (req, res) => {
    try {
      const health = await checkHealth();

      if (health.persistentStorage) {
        return res.status(200).send();
      }
      return res.status(500).send();
    } catch(err) {
      console.error(err);
      return res.status(500).send();
    }
  });
};

module.exports = {
  define,
};
