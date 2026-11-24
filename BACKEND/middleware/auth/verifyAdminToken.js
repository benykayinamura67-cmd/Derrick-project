const jwt = require('jsonwebtoken');

function verifyAdminToken(req, res, next) {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token using the secret in .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Make authenticated administrator details available to the next handler
        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.'
        });
    }
}

module.exports = verifyAdminToken;