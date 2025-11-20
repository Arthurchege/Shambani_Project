// backend/middleware/roleAuth.js

const roleAuth = (roles = []) => {
    return (req, res, next) => {
        // Assume req.user is already populated with user data (including role) from the JWT in auth.js

        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Authorization failed: Role not found in token.' });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            // User's role is not included in the allowed roles array
            return res.status(401).json({ msg: 'Access denied. You do not have permission to perform this action.' });
        }

        next(); // User has the required role, proceed to the route handler
    };
};

module.exports = roleAuth;