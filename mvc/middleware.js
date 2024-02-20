exports.idNotFound = (err, req, res, next) => {
  res.status(404).send({ msg: "not found" })
}

exports.invalidId = (err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
