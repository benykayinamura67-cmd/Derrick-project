
// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// PRIVATE DOCUMENT UPLOAD MIDDLEWARE
// File: middleware/uploadMiddleware.js
// =====================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

// =====================================================
// 01. PRIVATE UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    '..',
    'uploads',
    'private'
);

// Create the directory automatically if it does not exist.
fs.mkdirSync(uploadDirectory, { recursive: true });

// =====================================================
// 02. ALLOWED FILE TYPES
// =====================================================

const allowedMimeTypes = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png'
};

// =====================================================
// 03. MULTER STORAGE CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {

        const extension = allowedMimeTypes[file.mimetype];

        const uniqueFilename = `${randomUUID()}${extension}`;

        callback(null, uniqueFilename);
    }

});

// =====================================================
// 04. FILE VALIDATION
// =====================================================

const fileFilter = (req, file, callback) => {

    if (!allowedMimeTypes[file.mimetype]) {
        return callback(
            new Error('Only PDF, JPG, JPEG and PNG files are allowed.')
        );
    }

    callback(null, true);

};

// =====================================================
// 05. MULTER CONFIGURATION
// =====================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 2
    }

});

// =====================================================
// 06. EXPORT UPLOAD CONFIGURATION
// =====================================================

module.exports = upload;
