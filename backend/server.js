const app = require("./app");
const models = require("./models");
const port = process.env.PORT || 3001;

models.sequelize.sync({ alter: process.env.DB_SYNC_ALTER === "true" }).then(() => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
});
