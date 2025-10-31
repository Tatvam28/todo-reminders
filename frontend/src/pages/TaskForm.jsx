import React, { useState } from "react";

const TaskForm = ({ onSave }) => {
  const [form, setForm] = useState({ title: "", description: "", dueAt: "" });

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      dueAt: form.dueAt || undefined,
    };
    onSave(payload);
    setForm({ title: "", description: "", dueAt: "" });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <input
        className="input"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="input"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="input"
        type="datetime-local"
        value={form.dueAt}
        onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
      />
      <button className="button" type="submit">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
