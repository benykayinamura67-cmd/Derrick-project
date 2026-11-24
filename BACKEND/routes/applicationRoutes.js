
// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// ADMISSIONS APPLICATION ROUTES
// File: ROUTES/applicationRoutes.js
// =====================================================

const express = require('express');
const fs = require('fs');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

const {
    submitApplication
} = require('../controllers/applicationController');

// =====================================================
// 01. CLEAN UP PARTIALLY UPLOADED FILES
// =====================================================

async function cleanupFiles(files) {

    if (!files) return;

    const allFiles = Object.values(files).flat();

    await Promise.all(
        allFiles.map(async (file) => {
            try {
                await fs.promises.unlink(file.path);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Upload cleanup error:', error.message);
                }
            }
        })
    );
}

// =====================================================
// 02. HANDLE MULTER ERRORS
// =====================================================

function handleUpload(req, res, next) {

    const processUpload = upload.fields([
        {
            name: 'oLevelResults',
            maxCount: 1
        },
        {
            name: 'paymentProof',
            maxCount: 1
        }
    ]);

    processUpload(req, res, async (error) => {

        if (error) {

            await cleanupFiles(req.files);

            console.error('DOCUMENT UPLOAD ERROR:', error.message);

            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Each document must not exceed 5 MB.'
                });
            }

            if (error.code === 'LIMIT_FILE_COUNT' ||
                error.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid document upload. Please check the required file fields.'
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message || 'Document upload failed.'
            });
        }

        next();
    });
}

// =====================================================
// 03. SUBMIT APPLICATION
// =====================================================

router.post(
    '/',
    handleUpload,
    submitApplication
);

// =====================================================
// 04. EXPORT ROUTER
// =====================================================

module.exports = router;
