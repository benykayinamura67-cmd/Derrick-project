
// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// ADMIN APPLICATION ROUTES
// File: routes/adminApplicationRoutes.js
// =====================================================

const express = require('express');
const router = express.Router();

// Authentication and authorization
const verifyAdminToken = require('../middleware/auth/verifyAdminToken');
const authorizeAdminRole = require('../middleware/auth/authorizeAdminRole');

// Application controller
const {
    getAllApplications,
    updateApplicationStatus,
    getApplicationStatusHistory
} = require('../controllers/adminApplicationController');

// =====================================================
// GET ALL APPLICATIONS
// GET /api/admin/applications
// =====================================================

router.get(
    '/applications',
    verifyAdminToken,
    authorizeAdminRole('admin'),
    getAllApplications
);

// =====================================================
// GET APPLICATION STATUS HISTORY
// GET /api/admin/applications/:id/history
// =====================================================

router.get(
    '/applications/:id/history',
    verifyAdminToken,
    authorizeAdminRole('admin'),
    getApplicationStatusHistory
);

// =====================================================
// UPDATE APPLICATION STATUS
// PATCH /api/admin/applications/:id/status
// =====================================================

router.patch(
    '/applications/:id/status',
    verifyAdminToken,
    authorizeAdminRole('admin'),
    updateApplicationStatus
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
