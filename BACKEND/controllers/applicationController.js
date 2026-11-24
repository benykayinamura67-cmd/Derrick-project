
// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// ADMISSIONS APPLICATION CONTROLLER
// File: controllers/applicationController.js
// =====================================================

const pool = require('../config/database');

const fs = require('fs');
const path = require('path');

// =====================================================
// 01. CLEAN UP UPLOADED FILES
// =====================================================

async function deleteUploadedFiles(files) {

    if (!files) return;

    const allFiles = Object.values(files).flat();

    await Promise.all(
        allFiles.map(async (file) => {
            try {
                await fs.promises.unlink(file.path);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('File cleanup error:', error.message);
                }
            }
        })
    );
}

// =====================================================
// 02. VERIFY ACTUAL FILE CONTENT
// =====================================================

async function verifyFileContent(file) {

    const buffer = await fs.promises.readFile(file.path);

    const isPDF =
        file.mimetype === 'application/pdf' &&
        buffer.subarray(0, 5).toString() === '%PDF-';

    const isJPEG =
        file.mimetype === 'image/jpeg' &&
        buffer[0] === 0xFF &&
        buffer[1] === 0xD8 &&
        buffer[2] === 0xFF;

    const isPNG =
        file.mimetype === 'image/png' &&
        buffer.subarray(0, 8).equals(
            Buffer.from([
                0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
            ])
        );

    return isPDF || isJPEG || isPNG;
}

// =====================================================
// 03. SUBMIT ADMISSIONS APPLICATION
// =====================================================

async function submitApplication(req, res) {

    const files = req.files || {};

    let client;
    let transactionStarted = false;
    let applicationSaved = false;

    try {

        // -------------------------------------------------
        // A. READ FORM INFORMATION
        // -------------------------------------------------

        const {
            firstName,
            lastName,
            email,
            phone,
            oLevelCompleted,
            oLevelSchool,
            oLevelYear,
            oLevelIndex,
            program,
            paymentMethod,
            paymentStatus,
            transactionReference,
            paymentDate
        } = req.body;

        // -------------------------------------------------
        // B. VALIDATE PERSONAL INFORMATION
        // -------------------------------------------------

        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !email?.trim() ||
            !phone?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please complete all required personal information.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // -------------------------------------------------
        // C. VALIDATE O-LEVEL QUALIFICATION
        // -------------------------------------------------

        if (oLevelCompleted !== 'yes') {
            return res.status(400).json({
                success: false,
                message: 'You must have completed O-Level to apply.'
            });
        }

        if (
            !oLevelSchool?.trim() ||
            !oLevelYear ||
            !/^\d{4}$/.test(String(oLevelYear))
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your O-Level school and completion year.'
            });
        }

        const qualificationYear = Number(oLevelYear);

        if (
            qualificationYear < 1950 ||
            qualificationYear > new Date().getFullYear()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid O-Level completion year.'
            });
        }

        // -------------------------------------------------
        // D. VALIDATE PROGRAMME
        // -------------------------------------------------

        const programmeId = Number(program);

        if (
            !Number.isSafeInteger(programmeId) ||
            programmeId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid programme.'
            });
        }

        // -------------------------------------------------
        // E. VALIDATE PAYMENT
        // -------------------------------------------------

        const allowedPaymentMethods = [
            'bank-deposit',
            'bank-transfer',
            'mobile-money',
            'other'
        ];

        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid payment method.'
            });
        }

        if (!['paid', 'pending'].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid payment status.'
            });
        }

        if (
            paymentStatus === 'paid' &&
            (!transactionReference?.trim() || !paymentDate)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Paid applications require a payment reference and payment date.'
            });
        }

        if (
            paymentStatus === 'paid' &&
            !/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid payment date.'
            });
        }

        if (paymentStatus === 'paid') {
            const parsedDate = new Date(`${paymentDate}T00:00:00Z`);

            if (
                Number.isNaN(parsedDate.getTime()) ||
                parsedDate.toISOString().slice(0, 10) !== paymentDate
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'The payment date is invalid.'
                });
            }
        }

        // -------------------------------------------------
        // F. VALIDATE REQUIRED DOCUMENTS
        // -------------------------------------------------

        const oLevelFile = files.oLevelResults?.[0];
        const paymentFile = files.paymentProof?.[0];

        if (!oLevelFile) {
            return res.status(400).json({
                success: false,
                message: 'Please upload your O-Level results.'
            });
        }

        if (paymentStatus === 'paid' && !paymentFile) {
            return res.status(400).json({
                success: false,
                message: 'Please upload your payment proof.'
            });
        }

        const uploadedFiles = [oLevelFile, paymentFile].filter(Boolean);

        for (const file of uploadedFiles) {

            const validContent = await verifyFileContent(file);

            if (!validContent) {
                return res.status(400).json({
                    success: false,
                    message: `The uploaded file "${file.originalname}" does not match its claimed file type.`
                });
            }
        }

        // -------------------------------------------------
        // G. GET SERVER-SIDE ADMISSION PERIOD
        // -------------------------------------------------

        const admissionPeriod = process.env.ADMISSION_PERIOD;

        if (!admissionPeriod) {
            return res.status(503).json({
                success: false,
                message: 'Admissions are not configured yet. Please contact the school.'
            });
        }

        // -------------------------------------------------
        // H. CONNECT TO DATABASE
        // -------------------------------------------------

        client = await pool.connect();

        await client.query('BEGIN');
        transactionStarted = true;

        // -------------------------------------------------
        // I. INSERT OR UPDATE STUDENT
        // -------------------------------------------------

        const studentResult = await client.query(
            `INSERT INTO noahs_ark.students (
                first_name,
                last_name,
                email,
                phone_number
            )
            VALUES ($1, $2, $3, $4)

            ON CONFLICT (LOWER(TRIM(email)))
            DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                phone_number = EXCLUDED.phone_number,
                updated_at = NOW()

            RETURNING id`,

            [
                firstName.trim(),
                lastName.trim(),
                normalizedEmail,
                phone.trim()
            ]
        );

        const studentId = studentResult.rows[0].id;

        // -------------------------------------------------
        // J. CREATE APPLICATION
        // -------------------------------------------------

        const applicationResult = await client.query(
            `INSERT INTO noahs_ark.applications (
                student_id,
                programme_id,
                admission_period,
                application_status,
                o_level_completed,
                o_level_school,
                o_level_year,
                o_level_index_number,
                payment_method,
                payment_status,
                payment_reference,
                payment_date
            )
            VALUES (
                $1, $2, $3, 'submitted',
                TRUE, $4, $5, $6,
                $7, $8, $9, $10
            )
            RETURNING id`,

            [
                studentId,
                programmeId,
                admissionPeriod,
                oLevelSchool.trim(),
                qualificationYear,
                oLevelIndex?.trim() || null,
                paymentMethod,
                paymentStatus,
                paymentStatus === 'paid'
                    ? transactionReference.trim()
                    : null,
                paymentStatus === 'paid'
                    ? paymentDate
                    : null
            ]
        );

        const applicationId = applicationResult.rows[0].id;

        // -------------------------------------------------
        // K. SAVE DOCUMENT INFORMATION
        // -------------------------------------------------

        const documents = [
            {
                file: oLevelFile,
                type: 'o_level_results'
            }
        ];

        if (paymentFile) {
            documents.push({
                file: paymentFile,
                type: 'payment_proof'
            });
        }

        for (const document of documents) {

            const file = document.file;

            const relativeFilePath = path.posix.join(
                'uploads',
                'private',
                file.filename
            );

            await client.query(
                `INSERT INTO noahs_ark.application_documents (
                    application_id,
                    document_type,
                    original_filename,
                    stored_filename,
                    file_path,
                    mime_type,
                    file_size,
                    uploaded_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,

                [
                    applicationId,
                    document.type,
                    path.basename(file.originalname).slice(0, 255),
                    file.filename,
                    relativeFilePath,
                    file.mimetype,
                    file.size
                ]
            );
        }

        // -------------------------------------------------
        // L. COMMIT TRANSACTION
        // -------------------------------------------------

        await client.query('COMMIT');

        transactionStarted = false;
        applicationSaved = true;

        return res.status(201).json({
            success: true,
            message: 'Your admissions application has been submitted successfully.',
            application: {
                id: applicationId,
                status: 'submitted',
                admissionPeriod
            }
        });

    } catch (error) {

        if (transactionStarted && client) {
            await client.query('ROLLBACK').catch(() => {});
        }

        console.error('APPLICATION SUBMISSION ERROR:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'An active application already exists for this programme and admission period.'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'The selected programme or related record is invalid.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to submit your application. Please try again later.'
        });

    } finally {

        if (client) {
            client.release();
        }

        if (!applicationSaved) {
            await deleteUploadedFiles(files);
        }

    }
}

// =====================================================
// 04. EXPORT CONTROLLER
// =====================================================

module.exports = {
    submitApplication
};
