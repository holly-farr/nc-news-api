const app = require("../mvc/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const apiEndPointsJSON = require("../endpoints.json");

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
          const topicsArr = body.topics;
          for (const topicObj in topicsArr) {
            return topicObj;
          }
          const topicObjKeys = ["slug", "description"];
          expect(Object.keys(topicsArr[topicObj])).toBe(topicObjKeys);
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
});
