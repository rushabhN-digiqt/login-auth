const Sequelize = require("sequelize");
const config = require("./config.json");
require("dotenv").config();

const db = new Sequelize(config[process.env.NODE_ENV]);

db.authenticate()
  .then(() => {
    console.log("Successfully databse connection.");
  })
  .catch((err) => {
    console.log("Error connecting: " + err);
  });

module.exports = db;
