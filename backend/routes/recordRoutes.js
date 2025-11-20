// backend/routes/recordRoutes.js - Protected by Role-Based Access Control

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Basic Authentication
const roleAuth = require('../middleware/roleAuth'); // Role Checker
const FarmRecord = require('../models/FarmRecord');

// @route POST /api/records
// @desc Create a new farm record
// @access Private (Requires JWT AND 'data_entry' or 'admin' role)
router.post('/', [auth, roleAuth(['data_entry', 'admin'])], async (req, res) => {
    try {
        const newRecord = new FarmRecord({
            ...req.body,
            user: req.user.id // Assign the record to the authenticated user ID
        });

        const record = await newRecord.save();
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/records
// @desc Get ALL records for the authenticated user (READ access for all logged-in users)
// @access Private (Requires JWT)
router.get('/', auth, async (req, res) => {
    try {
        const records = await FarmRecord.find({ user: req.user.id }).sort({ dateRecorded: -1 });
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE /api/records/:id
// @desc Delete a farm record
// @access Private (Restricted to 'data_entry' or 'admin')
router.delete('/:id', [auth, roleAuth(['admin', 'data_entry'])], async (req, res) => {
    try {
        let record = await FarmRecord.findById(req.params.id);

        if (!record) return res.status(404).json({ msg: 'Record not found' });

        // Security check: Ensure the record belongs to the user trying to delete it
        if (record.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await FarmRecord.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;