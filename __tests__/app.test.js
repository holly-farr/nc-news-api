const app = require("../mvc/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const apiEndPointsJSON = require("../endpoints.json");
const { toBeSorted, toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("App", () => {
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
    test("should return 404 status and message of 'not found' if the article does not exist", () => {
      return request(app)
        .get(`/api/articles/9999999`)
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body.msg).toBe("not found");
        });
    });
  });
  describe.only("GET /api/articles", () => {
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
});
