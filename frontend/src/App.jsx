import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { setAuthToken } from "./api/api";

const App = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    navigate("/login");
  };
  return (
    <div className="container">
      <div className="header">
        <h1>Todo Reminders</h1>
        <div>
          {token ? (
            <button className="button" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="button">Login</button>
              </Link>
              <Link to="/signup">
                <button className="button" style={{ marginLeft: 8 }}>
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      <hr />
      <Outlet />
    </div>
  );
};

export default App;
