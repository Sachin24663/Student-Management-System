import React, { useState, useEffect } from "react";
import API from "../api";
import "./commonStyles.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    course_name: "",
    credits: "",
    department_id: "",
  });

  const fetchData = async () => {
    const [courseRes, deptRes] = await Promise.all([
      API.get("/courses"),
      API.get("/departments"),
    ]);
    setCourses(courseRes.data);
    setDepartments(deptRes.data);
  };

 useEffect(() => {
  const load = async () => {
    await fetchData();
  };
  load();
}, []);

  const addCourse = async () => {
    if (!form.course_name || !form.credits || !form.department_id) {
      alert("All fields required!");
      return;
    }
    try {
      await API.post("/courses", form);
      setForm({ course_name: "", credits: "", department_id: "" });
      fetchData();
      alert("✅ Course added!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding course");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      alert("🗑️ Course deleted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting course");
    }
  };

  return (
    <div className="card">
      <h2>Courses</h2>
      <div className="form-group">
        <input
          placeholder="Course name"
          value={form.course_name}
          onChange={(e) => setForm({ ...form, course_name: e.target.value })}
        />
        <input
          placeholder="Credits"
          value={form.credits}
          onChange={(e) => setForm({ ...form, credits: e.target.value })}
        />
        <select
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.department_name}
            </option>
          ))}
        </select>
        <button className="btn-add" onClick={addCourse}>
          ➕ Add
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.course_id}</td>
              <td>{c.course_name}</td>
              <td>{c.credits}</td>
              <td>{c.department_id?.department_name}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => deleteCourse(c._id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courses.length === 0 && <p>No courses found.</p>}
    </div>
  );
}

export default Courses;
