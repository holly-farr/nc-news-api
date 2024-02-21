exports.psqlErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};

exports.customErrors = (err, req, res, next) => {
  console.log(err)
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
}

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};