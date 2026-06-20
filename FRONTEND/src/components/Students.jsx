import React, { useState, useEffect } from "react";
import API from "../api";
import "./commonStyles.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
  });

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

 useEffect(() => {
  const load = async () => {
    await fetchStudents();
  };
  load();
}, []);

  const addStudent = async () => {
    if (!form.first_name || !form.last_name || !form.dob || !form.gender) {
      alert("All fields are required!");
      return;
    }
    try {
      await API.post("/students", form);
      setForm({ first_name: "", last_name: "", dob: "", gender: "" });
      fetchStudents();
      alert("✅ Student added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await API.delete(`/students/${id}`);
      setStudents(students.filter((s) => s._id !== id));
      alert("🗑️ Student deleted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting student");
    }
  };

  return (
    <div className="card">
      <h2>Students</h2>
      <div className="form-group">
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <input
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <button className="btn-add" onClick={addStudent}>
          ➕ Add
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.student_id}</td>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.dob?.slice(0, 10)}</td>
              <td>{s.gender}</td>
              <td>
                <button className="btn-delete" onClick={() => deleteStudent(s._id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && <p>No students found.</p>}
    </div>
  );
}

export default Students;
