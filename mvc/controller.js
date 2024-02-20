const { readAllTopics, readAllEndpoints } = require("../mvc/model");
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

exports.getAllEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};
