const express = require('express');
const router = express.Router();

const { adminLogin } = require('../controllers/auth/adminAuthController');

// Administrator login
router.post('/login', adminLogin);

module.exports = router;