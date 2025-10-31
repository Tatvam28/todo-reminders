import React, { useState } from "react";
import api, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAuthToken(res.data.token);
      navigate("/tasks");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  return (
    <form onSubmit={submit}>
      <input
        className="input"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="input"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="button" type="submit">
        Signup
      </button>
    </form>
  );
};

export default Signup;
