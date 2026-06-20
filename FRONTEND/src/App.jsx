import React, { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import Students from "./components/Students";
import Courses from "./components/Courses";
import Departments from "./components/Departments";
import Enrollment from "./components/Enrollment";
import Attendance from "./components/Attendance";
import "./index.css";

function App() {
  const [student, setStudent] = useState(null);

  return (
    <div className="container">
      <h1>🎓 Student Management System</h1>
      {student ? (
        <StudentDashboard student={student} onLogout={() => setStudent(null)} />
      ) : (
        <>
          <Login onLogin={setStudent} />
          <hr />
          <Students />
          <Departments />
          <Courses />
          <Enrollment />
          <Attendance />
        </>
      )}
    </div>
  );
}

export default App;
