const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  attendance_id: { type: String, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, required: true },
});

attendanceSchema.index({ student_id: 1, course_id: 1, date: 1 }, { unique: true });

// ✅ Auto-generate Attendance ID (ATT001, ATT002, etc.)
attendanceSchema.pre("save", async function (next) {
  if (!this.attendance_id) {
    const count = await mongoose.model("Attendance").countDocuments();
    this.attendance_id = `ATT${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
