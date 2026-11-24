
const express = require('express');
const router = express.Router();

const pool = require('../config/database');

// GET all active programmes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, programme_name, description
             FROM noahs_ark.programmes
             WHERE is_active = TRUE
             ORDER BY id ASC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            programmes: result.rows
        });

    } catch (error) {
        console.error('Error fetching programmes:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to retrieve programmes.'
        });
    }
});

module.exports = router;
