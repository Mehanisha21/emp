const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController'); // Import the payslip PDF controller

// This route handles GET requests to the base path of this router.
// The base path is typically defined in server.js when the router is mounted.
// For example, if you mount this router at '/api/payslip-pdf',
// this route corresponds to a GET request to /api/payslip-pdf.
//
// The 'getEmployeePayslipPDF' function is called, which handles the logic
// of fetching the PDF from SAP and sending it to the client.
//
// Note: This route assumes a preceding authentication middleware has
// populated req.user with the logged-in user's data.
router.get('/', pdfController.getEmployeePayslipPDF);
router.post('/', pdfController.getEmployeePayslipPDF);

// Test email sending endpoint for debugging
router.post('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'meharajnisha104@gmail.com',
        pass: process.env.EMAIL_PASS || 'fsjavrqhxiyzijig'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'meharajnisha104@gmail.com',
      to: req.body.email || 'test@example.com',
      subject: 'Test Email from Payslip API',
      text: 'This is a test email to verify SMTP configuration.'
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Test email sent successfully.' });
  } catch (error) {
    console.error('Test email sending error:', error);
    res.status(500).json({ message: 'Failed to send test email.', error: error.message || error });
  }
});

module.exports = router;
