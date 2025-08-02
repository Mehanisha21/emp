
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Define GET route to get employee profile by personnel number (pernr)
// Example usage: GET /api/profile?pernr=00000001
router.get('/', profileController.getEmployeeProfile);

module.exports = router;