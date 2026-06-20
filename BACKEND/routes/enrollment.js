const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");

// ✅ GET all enrollments
router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student_id")
      .populate({
        path: "course_id",
        populate: { path: "department_id" },
      });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new enrollment
router.post("/", async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    // Validation
    if (!student_id || !course_id) {
      return res.status(400).json({ message: "Student and Course are required!" });
    }

    // Prevent duplicate enrollments
    const existing = await Enrollment.findOne({ student_id, course_id });
    if (existing) {
      return res.status(400).json({ message: "Student already enrolled in this course!" });
    }

    // Create and save
    const newEnrollment = new Enrollment(req.body);
    const saved = await newEnrollment.save();

    // Populate before sending
    const populated = await saved
      .populate("student_id")
      .populate({
        path: "course_id",
        populate: { path: "department_id" },
      });

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE enrollment
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
