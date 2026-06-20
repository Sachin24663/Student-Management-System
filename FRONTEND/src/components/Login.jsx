import React, { useState } from "react";
import API from "../api";

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.get("/students");
      const student = res.data.find(
        (s) =>
          `${s.first_name} ${s.last_name}`.toLowerCase() === name.toLowerCase()
      );
      if (student) {
        onLogin(student);
        setError(""); // clear any previous error
      } else {
        setError("Student not found!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server not reachable!");
    }
  };

  return (
    <div className="login-box">
      <h3>Login as Student</h3>
      <input
        type="text"
        placeholder="Enter full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
