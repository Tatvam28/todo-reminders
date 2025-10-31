const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    dueAt: { type: Date }, // optional
    completed: { type: Boolean, default: false },
    reminderJobId: { type: String }, // store Agenda job id for cancellation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
