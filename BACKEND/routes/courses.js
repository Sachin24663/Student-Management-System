const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("department_id");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single course by ID (fixes 404)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("department_id");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST course
router.post("/", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const saved = await newCourse.save();
    const populated = await saved.populate("department_id");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ PUT update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("department_id");
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE course
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
