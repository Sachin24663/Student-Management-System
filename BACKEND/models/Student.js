const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: { type: String, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
});

// Auto-generate custom ID (STU001, STU002, etc.)
studentSchema.pre("save", async function (next) {
  if (this.student_id) return next();

  try {
    const lastStudent = await mongoose
      .model("Student")
      .findOne({}, {}, { sort: { _id: -1 } });
    let nextNumber = 1;
    if (lastStudent && lastStudent.student_id) {
      const lastNum = parseInt(lastStudent.student_id.replace("STU", ""), 10);
      nextNumber = lastNum + 1;
    }
    this.student_id = `STU${String(nextNumber).padStart(3, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Student", studentSchema);
