exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ msg: "endpoint does not exist" });
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
