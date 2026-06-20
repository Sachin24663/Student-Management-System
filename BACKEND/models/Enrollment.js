const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  enrollment_id: { type: String, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Enrolled" },
});

enrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });

// Auto ID generator (ENR001, ENR002…)
enrollmentSchema.pre("save", async function (next) {
  if (!this.enrollment_id) {
    const last = await mongoose.model("Enrollment").findOne({}, {}, { sort: { _id: -1 } });
    let nextNum = 1;
    if (last && last.enrollment_id) {
      const lastNum = parseInt(last.enrollment_id.replace("ENR", ""), 10);
      nextNum = lastNum + 1;
    }
    this.enrollment_id = `ENR${String(nextNum).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
