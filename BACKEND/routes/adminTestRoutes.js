const express = require('express');
const router = express.Router();

const verifyAdminToken = require('../middleware/auth/verifyAdminToken');
const authorizeAdminRole = require('../middleware/auth/authorizeAdminRole');

router.get(
    '/dashboard',
    verifyAdminToken,
    authorizeAdminRole('admin'),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Admin dashboard access granted.',
            admin: req.admin
        });
    }
);

module.exports = router;