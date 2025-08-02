const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/employee-login', loginController.employeeLogin);

module.exports = router;