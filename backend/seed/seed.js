require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../models/User");
const Task = require("../models/Task");

const run = async () => {
  await connectDB();
  await User.deleteMany({});
  await Task.deleteMany({});

  const hashed = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: hashed,
  });
  await Task.create([
    {
      user: user._id,
      title: "Finish assignment",
      description: "Complete the todo app assignment",
      dueAt: new Date(Date.now() + 60 * 60 * 1000),
    }, // 1 hour
    {
      user: user._id,
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      completed: false,
    },
  ]);
  console.log("Seeded test user: email=test@example.com password=password123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
