const request = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcrypt");

let token;
let userId;

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Task.deleteMany({});
  const hashed = await bcrypt.hash("pass123", 10);
  const user = await User.create({
    name: "T",
    email: "t@example.com",
    password: hashed,
  });
  userId = user._id;
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "t@example.com", password: "pass123" });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tasks", () => {
  it("creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test task");
  });
});
