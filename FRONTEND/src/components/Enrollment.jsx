import React, { useState, useEffect } from "react";
import API from "../api";
import "./Enrollment.css";

function Enrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ student_id: "", course_id: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [studentsRes, coursesRes, enrollRes] = await Promise.all([
          API.get("/students"),
          API.get("/courses"),
          API.get("/enrollments"),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setEnrollments(enrollRes.data);
      } catch (err) {
        console.error("Error loading enrollment data:", err);
        alert("⚠️ Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Add enrollment
  const addEnrollment = async () => {
    if (!form.student_id || !form.course_id) {
      alert("Please select both Student and Course!");
      return;
    }

    try {
      const payload = {
        student_id: form.student_id,
        course_id: form.course_id,
      };

      await API.post("/enrollments", payload);

      // Refresh enrollments
      const updated = await API.get("/enrollments");
      setEnrollments(updated.data);

      setForm({ student_id: "", course_id: "" });
      alert("✅ Enrollment added successfully!");
    } catch (err) {
      console.error("Error adding enrollment:", err);
      alert(err.response?.data?.message || "⚠️ Error adding enrollment");
    }
  };

  // ✅ Delete enrollment
  const deleteEnrollment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await API.delete(`/enrollments/${id}`);
      setEnrollments(enrollments.filter((e) => e._id !== id));
      alert("🗑️ Enrollment deleted!");
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      alert("⚠️ Error deleting enrollment");
    }
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="enroll-container">
      <h2>Enrollment Management</h2>

      <div className="enroll-form">
        <select
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.student_id} - {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <select
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.course_id} - {c.course_name}
            </option>
          ))}
        </select>

        <button className="btn-add" onClick={addEnrollment}>
          ➕ Enroll
        </button>
      </div>

      <table className="enroll-table">
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e._id}>
              <td>{e.enrollment_id}</td>
              <td>
                {e.student_id?.first_name} {e.student_id?.last_name}
              </td>
              <td>{e.course_id?.course_name}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>
                <button className="btn-delete" onClick={() => deleteEnrollment(e._id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {enrollments.length === 0 && <p>No enrollments found.</p>}
    </div>
  );
}

export default Enrollment;
