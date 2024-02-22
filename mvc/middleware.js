exports.psqlErrors = (err, req, res, next) => {
  if(err.code === "23503"){
    console.log(err)
  res.status(404).send({ msg: "not found" })
  }
  else if(err.code === "23502"){
    console.log(err)
  res.status(400).send({ msg: "bad request" })
  }
  else if (err.code === "22P02") {
    console.log(err)
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err)
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
}

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};