const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_id: { type: String, unique: true },
  course_name: { type: String, required: true },
  credits: { type: Number, required: true },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

// Auto-generate Course ID (CRS001, CRS002, etc.)
courseSchema.pre("save", async function (next) {
  if (this.course_id) return next();

  try {
    const lastCourse = await mongoose
      .model("Course")
      .findOne({}, {}, { sort: { _id: -1 } });
    let nextNumber = 1;
    if (lastCourse && lastCourse.course_id) {
      const lastNum = parseInt(lastCourse.course_id.replace("CRS", ""), 10);
      nextNumber = lastNum + 1;
    }
    this.course_id = `CRS${String(nextNumber).padStart(3, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Course", courseSchema);
