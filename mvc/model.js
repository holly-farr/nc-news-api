const db = require("../db/connection");

exports.readAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    if (rows === undefined) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return rows;
  });
};
