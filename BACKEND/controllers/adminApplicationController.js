
// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// ADMIN APPLICATION MANAGEMENT
// File: controllers/adminApplicationController.js
// =====================================================

const pool = require('../config/database');

// Allowed application statuses
const ALLOWED_STATUSES = [
    'draft',
    'submitted',
    'under_review',
    'accepted',
    'rejected',
    'withdrawn'
];

// =====================================================
// GET ALL APPLICATIONS
// GET /api/admin/applications
// =====================================================

async function getAllApplications(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 10, 1),
            50
        );

        const offset = (page - 1) * limit;

        const status = req.query.status
            ? String(req.query.status).trim()
            : null;

        if (status && !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application status.'
            });
        }

        const filterValues = [];
        let whereClause = '';

        if (status) {
            filterValues.push(status);
            whereClause = `WHERE a.application_status = $1`;
        }

        const countResult = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM noahs_ark.applications a
            ${whereClause}
            `,
            filterValues
        );

        const total = Number(countResult.rows[0].total);

        const listValues = [...filterValues, limit, offset];

        const limitPosition = filterValues.length + 1;
        const offsetPosition = filterValues.length + 2;

        const applicationsResult = await pool.query(
            `
            SELECT
                a.id AS application_id,
                a.admission_period,
                a.application_status,
                a.application_date,
                a.payment_status,
                a.payment_method,

                s.first_name,
                s.last_name,
                s.email,
                s.phone_number,

                p.programme_name

            FROM noahs_ark.applications a

            INNER JOIN noahs_ark.students s
                ON a.student_id = s.id

            INNER JOIN noahs_ark.programmes p
                ON a.programme_id = p.id

            ${whereClause}

            ORDER BY
                a.application_date DESC,
                a.id DESC

            LIMIT $${limitPosition}
            OFFSET $${offsetPosition}
            `,
            listValues
        );

        return res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully.',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            applications: applicationsResult.rows
        });

    } catch (error) {
        console.error('GET APPLICATIONS ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve applications.'
        });
    }
}

// =====================================================
// UPDATE APPLICATION STATUS
// PATCH /api/admin/applications/:id/status
// =====================================================

async function updateApplicationStatus(req, res) {
    const applicationId = Number(req.params.id);
    const newStatus = String(req.body.status || '').trim();
    const notes = req.body.notes
        ? String(req.body.notes).trim()
        : null;

    // Validate application ID
    if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid application ID.'
        });
    }

    // Validate requested status
    if (!ALLOWED_STATUSES.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid application status.'
        });
    }

    // Validate optional notes
    if (notes && notes.length > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Notes cannot exceed 1000 characters.'
        });
    }

    // Get authenticated administrator ID
    const adminId = req.admin && Number(req.admin.id);

    if (!Number.isSafeInteger(adminId) || adminId <= 0) {
        return res.status(401).json({
            success: false,
            message: 'Administrator identity could not be verified.'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Lock the application while updating it
        const applicationResult = await client.query(
            `
            SELECT id, application_status
            FROM noahs_ark.applications
            WHERE id = $1
            FOR UPDATE
            `,
            [applicationId]
        );

        if (applicationResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                success: false,
                message: 'Application not found.'
            });
        }

        const oldStatus = applicationResult.rows[0].application_status;

        // Prevent unnecessary duplicate status changes
        if (oldStatus === newStatus) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                success: false,
                message: 'Application already has this status.'
            });
        }

        // Update application status
        const updateResult = await client.query(
            `
            UPDATE noahs_ark.applications
            SET
                application_status = $1,
                reviewed_by = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, application_status
            `,
            [newStatus, adminId, applicationId]
        );

        // Record status change history
        await client.query(
            `
            INSERT INTO noahs_ark.application_status_history (
                application_id,
                old_status,
                new_status,
                changed_by,
                notes
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [applicationId, oldStatus, newStatus, adminId, notes]
        );

        await client.query('COMMIT');

        return res.status(200).json({
            success: true,
            message: 'Application status updated successfully.',
            application: {
                id: updateResult.rows[0].id,
                previous_status: oldStatus,
                current_status: updateResult.rows[0].application_status
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('UPDATE APPLICATION STATUS ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to update application status.'
        });

    } finally {
        client.release();
    }
}


// =====================================================
// GET APPLICATION STATUS HISTORY
// GET /api/admin/applications/:id/history
// =====================================================

async function getApplicationStatusHistory(req, res) {
    try {
        // Get application ID from the URL
        const applicationId = Number(req.params.id);

        // Validate application ID
        if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID.'
            });
        }

        // Check whether the application exists
        const applicationResult = await pool.query(
            `
            SELECT id
            FROM noahs_ark.applications
            WHERE id = $1
            `,
            [applicationId]
        );

        if (applicationResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Application not found.'
            });
        }

        // Retrieve application status history
        const historyResult = await pool.query(
            `
            SELECT
                h.id AS history_id,
                h.application_id,
                h.old_status,
                h.new_status,
                h.changed_by,
                admin.full_name AS changed_by_name,
                h.notes,
                h.changed_at

            FROM noahs_ark.application_status_history h

            LEFT JOIN noahs_ark.admin_users admin
                ON h.changed_by = admin.id

            WHERE h.application_id = $1

            ORDER BY
                h.changed_at DESC,
                h.id DESC
            `,
            [applicationId]
        );

        return res.status(200).json({
            success: true,
            message: 'Application status history retrieved successfully.',
            application_id: applicationId,
            total_records: historyResult.rows.length,
            history: historyResult.rows
        });

    } catch (error) {
        console.error('GET APPLICATION STATUS HISTORY ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve application status history.'
        });
    }
}

// =====================================================
// EXPORT CONTROLLER FUNCTIONS
// =====================================================

module.exports = {
    getAllApplications,
    updateApplicationStatus,
    getApplicationStatusHistory
};
