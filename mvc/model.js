const db = require("../db/connection");

exports.readAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.readAllArticles = () => {
  return db
    .query(
      `
    SELECT 
    articles.author, 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.readArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "not found",
        });
      }
      return rows;
    });
};

exports.readCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVotesByArticleId = (article_id, newVotes) => {
  const { inc_votes } = newVotes;
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentInDB = (comment_id) => {
 return db.query("DELETE FROM comments WHERE comment_id = $1;", [
    comment_id,
  ])
  .then((response)=>{
    if(response.rowCount === 0){
      return Promise.reject({status: 404, msg: "not found"})}
  })
};

