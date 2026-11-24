function authorizeAdminRole(...allowedRoles) {
    return (req, res, next) => {

        // Ensure the user has been authenticated first
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        // Check whether the administrator has permission
        if (!allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource.'
            });
        }

        next();
    };
}

module.exports = authorizeAdminRole;