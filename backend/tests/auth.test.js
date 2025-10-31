const request = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth", () => {
  it("signup and login", async () => {
    const res1 = await request(app)
      .post("/api/auth/signup")
      .send({ name: "A", email: "a@example.com", password: "pass123" });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.token).toBeDefined();

    const res2 = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@example.com", password: "pass123" });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.token).toBeDefined();
  });
});
