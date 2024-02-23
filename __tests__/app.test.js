const app = require("../mvc/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const apiEndPointsJSON = require("../endpoints.json");
const { toBeSorted, toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("App GET", () => {
  describe("GET /api/topics", () => {
    test("should return 200 status", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("should return array of objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(Array.isArray(["body.topics"])).toBe(true);
          expect(typeof body.topics[0]).toBe("object");
        });
    });
    test("should return array containing all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          const topicsArr = body.topics;
          expect(topicsArr.length).toBe(3);
        });
    });
    test("should return array of topic objects which contain 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test("should return 404 status and message of 'path not found' if url is inputted incorrectly", () => {
      return request(app)
        .get("/api/topicss0")
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("path not found");
        });
    });
  });
  describe("GET /api", () => {
    test("should return 200 status", () => {
      return request(app).get("/api").expect(200);
    });
    test("should return all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const body = response.body;
          const output = apiEndPointsJSON;
          expect(body.endpoints).toEqual(output);
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("should return article object when given an article id", () => {
      const articleId = 3;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then((response) => {
          const body = response.body;
          const expectedOut = {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(body.article[0]).toMatchObject(expectedOut);
        });
    });
    test("should return article object with id that matches given id", () => {
      const articleId = 4;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then((response) => {
          const body = response.body;
          const articleArr = body.article;
          expect(articleArr[0].article_id).toEqual(4);
        });
    });
    test("should return article object with correct properties", () => {
      const articleId = 4;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body.article[0]).toHaveProperty("article_id");
          expect(body.article[0]).toHaveProperty("article_img_url");
          expect(body.article[0]).toHaveProperty("author");
          expect(body.article[0]).toHaveProperty("body");
          expect(body.article[0]).toHaveProperty("created_at");
          expect(body.article[0]).toHaveProperty("title");
          expect(body.article[0]).toHaveProperty("topic");
          expect(body.article[0]).toHaveProperty("votes");
        });
    });
    test("should return 400 status and message of 'bad request' if anything but an id is inputted", () => {
      return request(app)
        .get(`/api/articles/hello9`)
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
    test("should return 404 status and error message if the article does not exist", () => {
      return request(app)
        .get(`/api/articles/9999999`)
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("not found");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("should return array containing all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(13);
        });
    });
    test("article objects should have correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const body = response.body;
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("article objects should be sorted by created_at date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("article does not have body", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articlesArr = response.body.articles;
          articlesArr.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("should return array of comment objects with correct article id and properties", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then((response) => {
          const commentsArr = response.body.comments;
          const expectedObj = {
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          };

          expect(Array.isArray(commentsArr)).toBe(true);
          expect(commentsArr.length).toBe(11);

          commentsArr.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comment).toMatchObject(expectedObj);
          });
        });
    });
    test("should return comments array with most recent comments first", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("should return 400 status and 'bad request' message if article id is inputted incorrectly", () => {
      const article_id = "hello9";
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
    test("should return empty array if article exists and has no comments", () => {
      const article_id = 7;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(body.comments).toEqual([]);
        });
    });
    test("should return 404 status and error message if article does not exist", () => {
      const article_id = 90999;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toEqual("not found");
        });
    });
  });
  describe("GET /api/users", () => {
    test("should return array containing all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length).toBe(4);
        });
    });
    test("user objects should have correct keys and correct data types for keys", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const body = response.body;
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            });
          });
        });
    });
    test("should return 404 status and 'path not found' message if url is inputted incorrectly", () => {
      return request(app)
        .get("/api/users123")
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("path not found")
        });
    });
  });
});

describe("App POST", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    test("should return 201 status and created comment", () => {
      const article_id = 2;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          username: "icellusedkars",
          body: "spiffing cup of tea m'lady",
        })
        .expect(201)
        .then((response) => {
          const comment = response.body.comment;
          const expectedComment = {
            comment_id: 19,
            body: "spiffing cup of tea m'lady",
            article_id: 2,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          };
          expect(comment).toEqual(expectedComment);
        });
    });
    test("should ignore any extra properties on inputted object", () => {
      const article_id = 1;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          username: "icellusedkars",
          body: "spiffing cup of tea m'lady",
          votes: 2,
          edits: "stirred not shaken",
        })
        .expect(201)
        .then((response) => {
          const comment = response.body.comment;
          const expectedComment = "spiffing cup of tea m'lady";
          const expectedObj = {
            comment_id: expect.any(Number),
            body: "spiffing cup of tea m'lady",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          };
          expect(comment.body).toBe(expectedComment);
          expect(comment).toMatchObject(expectedObj);
          expect(comment).not.toHaveProperty("edits");
        });
    });
    test("should return 400 status and 'bad request' message if invalid username is inputted", () => {
      const article_id = 2;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          username: "chelsea_brit",
          body: "spiffing cup of tea m'lady",
        })
        .expect(404)
        .then((response) => {
          const body = response.body;
          const expectedOutput = "not found";
          expect(body.msg).toBe(expectedOutput);
        });
    });
    test("should return 400 status and 'bad request' message if username or body are missing", () => {
      const article_id = 2;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          body: "spiffing cup of tea m'lady",
        })
        .expect(400)
        .then((response) => {
          const body = response.body;
          const expectedOutput = "bad request";
          expect(body.msg).toBe(expectedOutput);
        });
    });
    test("should return 404 status and error message if no article_id is provided", () => {
      return request(app)
        .post(`/api/articles/:article_id/comments`)
        .send({
          body: "spiffing cup of tea m'lady",
        })
        .expect(400)
        .then((response) => {
          const body = response.body;
          const expectedOutput = "bad request";
          expect(body.msg).toBe(expectedOutput);
        });
    });
    test("should return status 404 and error message if article does not exist", () => {
      const article_id = 999099;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          username: "icellusedkars",
          body: "spiffing cup of tea m'lady",
        })
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toEqual("not found");
        });
    });
  });
});

describe("App PATCH", () => {
  describe("PATCH /api/articles/:article_id", () => {
    test("should return updated article object with correct vote count", () => {
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: 5,
        })
        .expect(201)
        .then((response) => {
          const body = response.body;
          const expectedObj = {
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 105,
            article_img_url: expect.any(String),
          };
          expect(body.article).toMatchObject(expectedObj);
        });
    });
    test("should return article object with new vote count if article did not previously have votes property", () => {
      const article_id = 2;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: 5,
        })
        .expect(201)
        .then((response) => {
          const body = response.body;
          const expectedVotes = 5;
          const expectedObj = {
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 5,
            article_img_url: expect.any(String),
          };
          expect(body.article).toMatchObject(expectedObj);
          expect(body.article).toHaveProperty("votes");
          expect(body.article.votes).toEqual(expectedVotes);
        });
    });
    test("should return article object with updated vote count if increment is negative", () => {
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: -5,
        })
        .expect(201)
        .then((response) => {
          const body = response.body;
          const expectedVotes = 95;
          expect(body.article.votes).toEqual(expectedVotes);
        });
    });
    test("should return updated vote count and ignore other keys on request body", () => {
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: 5,
          likes: 4,
          favourite: "yes",
        })
        .expect(201)
        .then((response) => {
          const body = response.body;
          const expectedObj = {
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 105,
            article_img_url: expect.any(String),
          };
          expect(body.article).toMatchObject(expectedObj);
        });
    });
    test("should return article object with updated vote count if increment is negative and new vote count is below 0", () => {
      const article_id = 2;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: -5,
        })
        .expect(201)
        .then((response) => {
          const body = response.body;
          const expectedVotes = -5;
          expect(body.article.votes).toEqual(expectedVotes);
        });
    });
    test("should return status 404 and error message if article does not exist", () => {
      const article_id = 999099;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: -5,
        })
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("not found");
        });
    });
    test("should return status 400 and error message if article id is not a number", () => {
      const article_id = "number 7";
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: -5,
        })
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
    test("should return status 400 and error message if inc_votes is not a number", () => {
      const article_id = "number 6";
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({
          inc_votes: "number 4",
        })
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
    test("should return status 400 and error message if given an empty request body", () => {
      const article_id = 1;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send({})
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("App DELETE", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("should delete comment and return 204 status", () => {
      const comment_id = 2;
      return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
    });
    test("should return status 404 and error message if given comment_id which doesn't exist", () => {
      const comment_id = 90999;
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toEqual("not found");
        });
    });
    test("should return status 400 and 'bad request' message if given invalid comment id", () => {
      const comment_id = "hello9";
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(400)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("bad request");
        });
    });
  });
});
