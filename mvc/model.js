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
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};
