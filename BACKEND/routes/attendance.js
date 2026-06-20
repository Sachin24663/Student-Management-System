const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');


// GET all attendance records
router.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('student_id')
            .populate('course_id');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET attendance by ID
router.get('/:id', async (req, res) => {
    try {
        const record = await Attendance.findById(req.params.id)
            .populate('student_id')
            .populate('course_id');
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new attendance record
router.post('/', async (req, res) => {
    try {
        const newRecord = new Attendance(req.body);
        const savedRecord = await newRecord.save();
        res.json(savedRecord);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update attendance
router.put('/:id', async (req, res) => {
    try {
        const updatedRecord = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecord);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE attendance record
router.delete('/:id', async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Attendance deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
