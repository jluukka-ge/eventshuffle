const { defineServices, defineApp } = require('./app');

const services = defineServices(process.env);
const app = defineApp(services);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
