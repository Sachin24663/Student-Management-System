const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ These middleware lines belong here
app.use(cors());
app.use(express.json()); // <-- only here

// Routes
app.use("/api/students", require("./routes/students"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/enrollments", require("./routes/enrollment"));
app.use("/api/attendance", require("./routes/attendance"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/student_management")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Start server
app.listen(process.env.PORT || 5007, () =>
  console.log("🚀 Server running on port 5007")
);
