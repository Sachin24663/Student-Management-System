import React, { useState, useEffect } from "react";
import API from "../api";
import "./commonStyles.css";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ department_name: "", hod: "" });

  const fetchDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data);
  };
 useEffect(() => {
  const load = async () => {
    await fetchDepartments();
  };
  load();
}, []);
  const addDepartment = async () => {
    if (!form.department_name || !form.hod) {
      alert("All fields required!");
      return;
    }
    try {
      await API.post("/departments", form);
      setForm({ department_name: "", hod: "" });
      fetchDepartments();
      alert("✅ Department added!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding department");
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await API.delete(`/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
      alert("🗑️ Department deleted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting department");
    }
  };

  return (
    <div className="card">
      <h2>Departments</h2>
      <div className="form-group">
        <input
          placeholder="Department name"
          value={form.department_name}
          onChange={(e) =>
            setForm({ ...form, department_name: e.target.value })
          }
        />
        <input
          placeholder="Head of Department"
          value={form.hod}
          onChange={(e) => setForm({ ...form, hod: e.target.value })}
        />
        <button className="btn-add" onClick={addDepartment}>
          ➕ Add
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>HOD</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d._id}>
              <td>{d.department_id}</td>
              <td>{d.department_name}</td>
              <td>{d.hod}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => deleteDepartment(d._id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {departments.length === 0 && <p>No departments found.</p>}
    </div>
  );
}

export default Departments;
