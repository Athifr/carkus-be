import { expect } from "chai";
import { config } from "dotenv";
import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { app } from "../src/app.js";

config();

describe("Integration Testing", function () {
  const request = supertest(app);
  let token;
  let campusId;
  let threadId;
  let commentId;

  before(async function () {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    await mongoose.connection.db.dropDatabase();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  describe("POST /auth/register", function () {
    it("should return 201", async function () {
      const response = await request.post("/auth/register").send({
        username: "user123",
        password: "asd",
      });
      expect(response.status).equals(201);
    });

    it("should return 409", async function () {
      const response = await request.post("/auth/register").send({
        username: "user123",
        password: "asd",
      });
      expect(response.status).equals(409);
    });
  });

  describe("POST /auth/login", function () {
    it("should return 200", async function () {
      const response = await request.post("/auth/login").send({
        username: "user123",
        password: "asd",
      });
      expect(response.status).equals(200);
      expect(response.body).to.have.property("token");
      token = response.body.token;
    });

    it("should return 401", async function () {
      const response = await request.post("/auth/login").send({
        username: "user123",
        password: "incorrectpassword",
      });
      expect(response.status).equals(401);
    });

    it("should return 404", async function () {
      const response = await request.post("/auth/login").send({
        username: "user1234",
        password: "asd",
      });
      expect(response.status).equals(404);
    });
  });

  describe("POST /campus", function () {
    it("should return 201", async function () {
      const response = await request
        .post("/campus")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Campus 1",
          address: "Address 1",
          description: "Description 1",
          accreditation: "A",
          status: "PTN",
          faculties: {
            name: "Faculty 1",
            accreditation: "A",
          },
          links: {
            instagram: "instagram.com",
            website: "website.com",
          },
          imageUrl: "https://picsum.photos/200",
        });
      expect(response.status).equals(201);
      expect(response.body).to.have.property("_id");
      campusId = response.body._id;
    });

    it("should return 401", async function () {
      const response = await request.post("/campus").send({
        name: "Campus 1",
        address: "Address 1",
        description: "Description 1",
        accreditation: "A",
        status: "PTN",
        faculties: {
          name: "Faculty 1",
          accreditation: "A",
        },
        links: {
          instagram: "instagram.com",
          website: "website.com",
        },
        imageUrl: "https://picsum.photos/200",
      });
      expect(response.status).equals(401);
    });
  });

  describe("GET /campus", function () {
    it("should return 200", async function () {
      const response = await request.get("/campus");
      expect(response.status).equals(200);
    });
  });

  describe("GET /campus/:campusId", function () {
    it("should return 200", async function () {
      const response = await request.get(`/campus/${campusId}`);
      expect(response.status).equals(200);
    });

    it("should return 404", async function () {
      const response = await request.get(`/campus/${Types.ObjectId}`);
      expect(response.status).equals(404);
    });
  });

  describe("PUT /campus/:campusId", function () {
    it("should return 200", async function () {
      const response = await request
        .put(`/campus/${campusId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "PTS",
        });
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request.put(`/campus/${campusId}`).send({
        status: "PTS",
      });
      expect(response.status).equals(401);
    });

    it("should return 404", async function () {
      const response = await request
        .put(`/campus/${Types.ObjectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "PTS",
        });
      expect(response.status).equals(404);
    });
  });

  describe("POST /campus/:campusId/threads", function () {
    it("should return 201", async function () {
      const response = await request
        .post(`/campus/${campusId}/threads`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
          content: "test",
        });
      expect(response.status).equals(201);
      expect(response.body).to.have.property("_id");
      threadId = response.body._id;
    });

    it("should return 401", async function () {
      const response = await request.post(`/campus/${campusId}/threads`).send({
        title: "test",
        content: "test",
      });
      expect(response.status).equals(401);
    });

    it("should return 401", async function () {
      const response = await request
        .post(`/campus/${campusId}/threads`)
        .set("Authorization", `Bearer invalidtoken`)
        .send({
          title: "test",
          content: "test",
        });
      expect(response.status).equals(401);
    });
  });

  describe("GET /campus/:campusId/threads", function () {
    it("should return 200", async function () {
      const response = await request.get(`/campus/${campusId}/threads`);
      expect(response.status).equals(200);
    });
  });

  describe("GET /campus/:campusId/threads/:threadId", function () {
    it("should return 200", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${threadId}`
      );
      expect(response.status).equals(200);
    });

    it("should return 404", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${Types.ObjectId}`
      );
      expect(response.status).equals(404, response.body.message);
    });
  });

  describe("PUT /campus/:campusId/threads/:threadId", function () {
    it("should return 200", async function () {
      const response = await request
        .put(`/campus/${campusId}/threads/${threadId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test2",
          content: "test2",
        });
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request
        .put(`/campus/${campusId}/threads/${threadId}`)
        .send({
          title: "test2",
          content: "test2",
        });
      expect(response.status).equals(401);
    });
  });

  describe("POST /campus/:campusId/threads/:threadId/comments", function () {
    it("should return 201", async function () {
      const response = await request
        .post(`/campus/${campusId}/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "test",
        });
      expect(response.status).equals(201);
      expect(response.body).to.have.property("_id");
      commentId = response.body._id;
    });

    it("should return 401", async function () {
      const response = await request
        .post(`/campus/${campusId}/threads/${threadId}/comments`)
        .send({
          content: "test",
        });
      expect(response.status).equals(401);
    });
  });

  describe("GET /campus/:campusId/threads/:threadId/comments", function () {
    it("should return 200", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${threadId}/comments`
      );
      expect(response.status).equals(200);
    });
  });

  describe("GET /campus/:campusId/threads/:threadId/comments/:commentId", function () {
    it("should return 200", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${threadId}/comments/${commentId}`
      );
      expect(response.status).equals(200);
    });

    it("should return 404", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${threadId}/comments/${Types.ObjectId}`
      );
      expect(response.status).equals(404);
    });

    it("should return 404", async function () {
      const response = await request.get(
        `/campus/${campusId}/threads/${Types.ObjectId}/comments/${commentId}`
      );
      expect(response.status).equals(404);
    });
  });

  describe("PUT /campus/:campusId/threads/:threadId/comments/:commentId", function () {
    it("should return 200", async function () {
      const response = await request
        .put(`/campus/${campusId}/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "test2",
        });
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request
        .put(`/campus/${campusId}/threads/${threadId}/comments/${commentId}`)
        .send({
          content: "test2",
        });
      expect(response.status).equals(401);
    });
  });

  describe("DELETE /campus/:campusId/threads/:threadId/comments/:commentId", function () {
    it("should return 200", async function () {
      const response = await request
        .delete(`/campus/${campusId}/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request.delete(
        `/campus/${campusId}/threads/${threadId}/comments/${commentId}`
      );
      expect(response.status).equals(401);
    });

    it("should return 404", async function () {
      const response = await request
        .delete(`/campus/${campusId}/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).equals(404);
    });
  });

  describe("DELETE /campus/:campusId/threads/:threadId", function () {
    it("should return 200", async function () {
      const response = await request
        .delete(`/campus/${campusId}/threads/${threadId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request.delete(
        `/campus/${campusId}/threads/${threadId}`
      );
      expect(response.status).equals(401);
    });

    it("should return 404", async function () {
      const response = await request.delete(
        `/campus/${campusId}/threads/${Types.ObjectId}`
      );
      expect(response.status).equals(404);
    });
  });

  describe("DELETE /campus/:campusId", function () {
    it("should return 200", async function () {
      const response = await request
        .delete(`/campus/${campusId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).equals(200);
    });

    it("should return 401", async function () {
      const response = await request.delete(`/campus/${campusId}`);
      expect(response.status).equals(401);
    });

    it("should return 404", async function () {
      const response = await request
        .delete(`/campus/${Types.ObjectId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).equals(404);
    });
  });
});
