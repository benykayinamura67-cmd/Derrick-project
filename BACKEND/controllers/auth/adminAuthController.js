const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/database');

async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        // Find administrator by email
        const result = await pool.query(
            `SELECT id, full_name, email, password_hash, role, is_active
             FROM noahs_ark.admin_users
             WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const admin = result.rows[0];

        // Check whether the account is active
        if (!admin.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your administrator account is inactive.'
            });
        }

        // Verify password against stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Create authentication token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        // Send successful login response
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            admin: {
                id: admin.id,
                full_name: admin.full_name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Administrator login error:', error);

        return res.status(500).json({
            success: false,
            message: 'An unexpected server error occurred.'
        });
    }
}

module.exports = {
    adminLogin
};