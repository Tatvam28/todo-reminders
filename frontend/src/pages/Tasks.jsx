import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../api/api";
import TaskForm from "./TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);

  const fetch = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const createOrUpdate = async (data, id) => {
    try {
      if (id) {
        await api.put(`/tasks/${id}`, data);
      } else {
        await api.post("/tasks", data);
      }
      fetch();
    } catch (err) {
      alert("Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete task?")) return;
    await api.delete(`/tasks/${id}`);
    fetch();
  };

  const complete = async (id) => {
    await api.post(`/tasks/${id}/complete`);
    fetch();
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <TaskForm onSave={createOrUpdate} />
      <div>
        {tasks.map((t) => (
          <div className="task" key={t._id}>
            <div>
              <div className="task-title">
                {t.title}{" "}
                {t.completed && <span className="small"> (Completed)</span>}
              </div>
              <div className="small">{t.description}</div>
              <div className="small">
                Due: {t.dueAt ? new Date(t.dueAt).toLocaleString() : "—"}
              </div>
            </div>
            <div className="controls">
              {!t.completed && (
                <button className="button" onClick={() => complete(t._id)}>
                  Complete
                </button>
              )}
              <button
                className="button"
                onClick={() => {
                  const title = prompt("Title", t.title);
                  if (title) api.put(`/tasks/${t._id}`, { title }).then(fetch);
                }}
              >
                Edit
              </button>
              <button className="button" onClick={() => remove(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
