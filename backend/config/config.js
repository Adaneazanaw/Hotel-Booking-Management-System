require("dotenv").config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./database.sqlite",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "AdaneGrandDB",
    host: process.env.DB_HOST || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
};
