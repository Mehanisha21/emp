const express = require('express');
const router = express.Router();
const payslipController = require('../controllers/payslipController'); // Adjust path as needed

// Define GET route to get employee payslip by personnel number (pernr)
// Example usage: GET /api/payslip?pernr=00000001
router.get('/', payslipController.getEmployeePayslip);

module.exports = router;