const { defineServices, defineApp } = require('./app');

const { PORT } = process.env;

const services = defineServices(process.env);
const app = defineApp(services);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
