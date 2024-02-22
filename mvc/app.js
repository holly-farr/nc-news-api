const express = require("express");
const app = express();
const {
  getAllTopics,
  getAllEndpoints,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../mvc/controller");
const {
  psqlErrors,
  serverErrors,
  customErrors,
} = require("../mvc/middleware");

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(psqlErrors);

app.use(customErrors);

app.use(serverErrors);

module.exports = app;
