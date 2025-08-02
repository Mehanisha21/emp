// server.js
require('dotenv').config();  // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');  // Your login routes
const profileController = require('./controllers/profileController');
const leaveRoutes = require('./routes/leave'); 
const payslipRoutes = require('./routes/payslip');
const pdfRoutes = require('./routes/pdf');
const app = express();

// Use port from .env or default to 3000
const PORT = process.env.PORT || 3000;

// Enable CORS - allow requests from Angular Dev Server (http://localhost:4200)
app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Middleware to parse JSON bodies from incoming requests
app.use(bodyParser.json());

// Setup routes - all login routes prefixed with /api
app.use('/api', loginRoutes);
app.get('/api/profile', profileController.getEmployeeProfile);
app.use('/api/leave', leaveRoutes);
app.use('/api/payslip', payslipRoutes);
app.use('/api/payslip-pdf', pdfRoutes);

// Basic root route to check server status
app.get('/', (req, res) => {
  res.send('Employee Login API is running! Access /api/employee-login for login functionality.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api/employee-login`);
});
