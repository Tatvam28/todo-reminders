const Agenda = require("agenda");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { sendReminderEmail } = require("./emailService");
const Task = require("../models/Task");
const User = require("../models/User");
const mongoConnectionString = process.env.MONGO_URI;
const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: process.env.AGENDA_COLLECTION || "agendaJobs",
  },
  processEvery: "1 minute",
});

// Define job to send reminder
agenda.define("send-task-reminder", async (job) => {
  const { taskId } = job.attrs.data || {};
  if (!taskId) return;

  const task = await Task.findById(taskId).populate("user");
  if (!task) {
    console.log("Task not found for reminder:", taskId);
    return;
  }

  if (task.completed) {
    console.log("Task already completed — skipping reminder:", taskId);
    return;
  }

  const user = task.user;
  const remindMinutes = Number(process.env.REMINDER_MINUTES) || 30;
  const dueAtStr = task.dueAt
    ? new Date(task.dueAt).toLocaleString()
    : "No due time";

  const subject = `Reminder: ${task.title} (due in ${remindMinutes} minutes)`;
  const text = `Hi ${user.name || ""},\n\nThis is a reminder for your task "${
    task.title
  }" due at ${dueAtStr}.\n\nTask: ${
    task.description || "No description"
  }\n\nPlease complete or update your task.\n\n— Todo Reminders App`;

  try {
    await sendReminderEmail({ to: user.email, subject, text });
    console.log(`Sent reminder for task ${taskId} to ${user.email}`);
  } catch (err) {
    console.error("Failed to send reminder email", err);
  }
});

// Start agenda
const startAgenda = async () => {
  await agenda.start();
  console.log("Agenda started");
};

const scheduleReminderForTask = async (task) => {
  if (!task.dueAt) return null;
  // compute reminder time
  const reminderMinutes = Number(process.env.REMINDER_MINUTES) || 30;
  const reminderDate = new Date(
    task.dueAt.getTime() - reminderMinutes * 60 * 1000
  );
  if (reminderDate <= new Date()) {
    // If reminder time already passed, skip scheduling
    console.log("Reminder time already passed for task", task._id.toString());
    return null;
  }

  // create job
  const job = await agenda.schedule(reminderDate, "send-task-reminder", {
    taskId: task._id.toString(),
  });
  // Persist job id in task.reminderJobId
  task.reminderJobId = job.attrs._id.toString();
  await task.save();
  return job;
};

const cancelReminderForTask = async (task) => {
  if (!task.reminderJobId) return;
  try {
    await agenda.cancel({
      _id: agenda._collection.s.pkFactory(task.reminderJobId),
    });
  } catch (err) {
    // fallback: cancel by data.taskId
    await agenda.cancel({ "data.taskId": task._id.toString() });
  }
  task.reminderJobId = undefined;
  await task.save();
};

module.exports = {
  agenda,
  startAgenda,
  scheduleReminderForTask,
  cancelReminderForTask,
};
