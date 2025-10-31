const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  markComplete,
} = require("../controllers/taskController");

router.use(auth);

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/complete", markComplete);

module.exports = router;
