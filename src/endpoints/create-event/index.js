const define = (app, createEvent) => {
  app.post('/api/v1/event', async (req, res) => {
    try {
      const { name, dates } = req.body;
      const newEvent = await createEvent(name, dates);

      return res.json({ id: newEvent._id });
    } catch(err) {
      console.error(err);
      return res.status(500).send();
    }
  });
};

module.exports = {
  define,
};
