const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController'); // Adjust path as needed

// Define GET route to get employee leave records by personnel number (pernr)
// Example usage: GET /api/leave?pernr=00000001
router.get('/', leaveController.getEmployeeLeave);

module.exports = router;