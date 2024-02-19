const express = require("express");
const app = express();
const { getAllTopics } = require("../mvc/controller");
const { handle404Errors, handleServerErrors } = require("../mvc/middleware");

app.use(express.json());

app.get("/api/healthcheck", (req, res) => {
  res.status(200).send({msg: "healthcheck passed"});
});

app.get("/api/topics", getAllTopics);

app.all("/*", handle404Errors);

app.all("/*", handleServerErrors);

module.exports = app;
 