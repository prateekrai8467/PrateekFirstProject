/* src/middleware/roleMiddleware.js */

// Higher-order function to check for specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was added by the protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { authorize };