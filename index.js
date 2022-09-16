const express = require("express");
const morgan = require("morgan");

const db = require("./models/index");
const router = require("./routes/user.routes");
require("dotenv").config();

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length]:body - :response-time ms")
);
app.use(express.json());

app.use("/user", router);

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listen on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error to syncing with db: " + err);
  });
