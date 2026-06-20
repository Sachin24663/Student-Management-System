import React, { useState, useEffect } from "react";
import API from "../api";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ student_id: "", course_id: "", date: "" });

  useEffect(() => {
    API.get("/students").then((r) => setStudents(r.data));
    API.get("/courses").then((r) => setCourses(r.data));
    API.get("/attendance").then((r) => setAttendance(r.data));
  }, []);

  const markAttendance = async () => {
    try {
      await API.post("/attendance", form);
      setForm({ student_id: "", course_id: "", date: "" });
      const res = await API.get("/attendance");
      setAttendance(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error marking attendance");
    }
  };

  return (
    <div>
      <h2>Attendance</h2>
      <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>{s.first_name} {s.last_name}</option>
        ))}
      </select>
      <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>{c.course_name}</option>
        ))}
      </select>
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/>
      <button onClick={markAttendance}>Mark Attendance</button>
      <ul>
        {attendance.map((a) => (
          <li key={a._id}>
            {a.student_id?.first_name} - {a.course_id?.course_name} ({new Date(a.date).toDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
