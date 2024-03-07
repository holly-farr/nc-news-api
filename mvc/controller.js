const {
  readAllTopics,
  readAllArticles,
  readArticleById,
  readCommentsByArticleId,
  readAllUsers,
  insertCommentByArticleId,
  updateVotesByArticleId,
  deleteCommentInDB,
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
  const topic = req.query.topic
  readAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const comment_count = req.query.comment_count
  readArticleById(article_id, comment_count)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  return Promise.all([
    readArticleById(article_id),
    readCommentsByArticleId(article_id),
  ])
    .then((comments) => {
      res.status(200).send({ comments: comments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  readAllUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const newComment = req.body;
  return Promise.all([
    readArticleById(article_id),
    insertCommentByArticleId(article_id, newComment),
  ])
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const newVotes = req.body;
  return Promise.all([
    readArticleById(article_id),
    updateVotesByArticleId(article_id, newVotes),
  ])
    .then((article) => {
      res.status(201).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
    deleteCommentInDB(comment_id).then(()=>{
      res.status(204).send()
    })
    .catch((err)=>{
      next(err)
    })
};

exports.getAllEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};
