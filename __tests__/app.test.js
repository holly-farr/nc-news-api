const app = require("../mvc/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("App", () => {
  describe("GET /api/healthcheck", () => {
    test("should return 200 status", () => {
      return request(app).get("/api/healthcheck").expect(200);
    });
  });
  describe("GET /api/topics", () => {
    test("should return 200 status", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("should return 200 status and array of objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          expect(Array.isArray(["body.topics"])).toBe(true);
          expect(typeof body.topics[0]).toBe("object");
        });
    });
    test("should return 200 status and array containing all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          const topicsArr = body.topics;
          expect(topicsArr.length).toBe(3);
        });
    });
    test("should return 200 status and array of topic objects which contain 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const body = response.body;
          const topicsObj = body.topics[0];
          expect(topicsObj).toHaveProperty("slug");
          expect(topicsObj).toHaveProperty("description");
        });
    });
    test("should return 404 status and message of 'endpoint does not exist' if url is inputted incorrectly", () => {
      return request(app)
        .get("/api/topicss0")
        .expect(404)
        .then((response) => {
          const body = response.body;
          expect(body).toEqual({ msg: "endpoint does not exist" });
        });
    });
  });
});
