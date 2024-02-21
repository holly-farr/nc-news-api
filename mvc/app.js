const express = require("express");
const app = express();
const { getAllTopics, getAllEndpoints, getAllArticles, getArticleById } = require("../mvc/controller");
const { handleServerErrors, invalidId, idNotFound } = require("../mvc/middleware");

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(invalidId)

app.use(idNotFound)

app.use(handleServerErrors);

module.exports = app;
