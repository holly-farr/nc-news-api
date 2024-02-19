const { readAllTopics } = require("../mvc/model");

exports.getAllTopics = (req, res, next) => {
  readAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}; 
