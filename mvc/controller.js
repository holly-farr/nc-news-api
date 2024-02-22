const {
  readAllTopics,
  readAllArticles,
  readArticleById,
  readCommentsByArticleId,
  insertCommentByArticleId,
} = require("../mvc/model");
const endpoints = require("../endpoints.json");

exports.getAllTopics = (req, res, next) => {
  readAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  readAllArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  readArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  return Promise.all([readArticleById(article_id), readCommentsByArticleId(article_id)])
    .then((comments) => {
      res.status(200).send({ comments: comments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id
  const newComment = req.body;
  return Promise.all([readArticleById(article_id), insertCommentByArticleId(article_id, newComment)])
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
    })
    .catch((err) => {
      next(err);
    });
};



exports.getAllEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};
