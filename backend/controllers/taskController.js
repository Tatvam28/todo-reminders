const Task = require("../models/Task");
const {
  scheduleReminderForTask,
  cancelReminderForTask,
} = require("../services/agenda");

const createTask = async (req, res) => {
  try {
    const { title, description, dueAt } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueAt: dueAt ? new Date(dueAt) : undefined,
    });

    // schedule reminder if dueAt provided
    if (task.dueAt) {
      await scheduleReminderForTask(task);
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Create task failed", error: err.message });
  }
};

const listTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({
    dueAt: 1,
    createdAt: -1,
  });
  res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldDue = task.dueAt ? task.dueAt.toISOString() : null;
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.dueAt = req.body.dueAt ? new Date(req.body.dueAt) : undefined;
    task.completed = req.body.completed ?? task.completed;

    // If dueAt changed, cancel old reminder and reschedule
    const newDue = task.dueAt ? task.dueAt.toISOString() : null;
    if (oldDue !== newDue) {
      await cancelReminderForTask(task);
      if (task.dueAt) {
        await scheduleReminderForTask(task);
      }
    }

    // If marked completed, cancel reminder
    if (task.completed) {
      await cancelReminderForTask(task);
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    await cancelReminderForTask(task);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const markComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.completed = true;
    await cancelReminderForTask(task);
    await task.save();
    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Mark complete failed", error: err.message });
  }
};

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  markComplete,
};
