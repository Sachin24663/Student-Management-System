import React, { useEffect, useState } from "react";
import API from "../api";

function StudentDashboard({ student, onLogout }) {
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Fetch both enrollments and attendance when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, attRes] = await Promise.all([
          API.get("/enrollments"),
          API.get("/attendance"),
        ]);

        // Filter only this student's data
        const myEnrollments = enrollRes.data.filter(
          (e) => e.student_id?._id === student._id
        );
        const myAttendance = attRes.data.filter(
          (a) => a.student_id?._id === student._id
        );

        setEnrollments(myEnrollments);
        setAttendance(myAttendance);
      } catch (err) {
        console.error("Error loading student dashboard:", err);
      }
    };

    fetchData();
  }, [student]);

  return (
    <div className="dashboard-container">
      <div className="card student-info">
        <h2>Welcome, {student.first_name} {student.last_name}</h2>
        <p><strong>Date of Birth:</strong> {student.dob?.slice(0, 10)}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="card">
        <h3>📘 My Enrollments</h3>
        {enrollments.length > 0 ? (
          <table>
            <thead>
              <tr><th>Course</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e._id}>
                  <td>{e.course_id?.course_name}</td>
                  <td>{e.status}</td>
                  <td>{e.date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No enrollments found.</p>
        )}
      </div>

      <div className="card">
        <h3>📅 My Attendance</h3>
        {attendance.length > 0 ? (
          <table>
            <thead>
              <tr><th>Course</th><th>Date</th></tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a._id}>
                  <td>{a.course_id?.course_name}</td>
                  <td>{a.date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
