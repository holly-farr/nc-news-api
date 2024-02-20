const express = require("express");
const app = express();
const { getAllTopics, getAllEndpoints } = require("../mvc/controller");
const { handleServerErrors } = require("../mvc/middleware");

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleServerErrors);

module.exports = app;
