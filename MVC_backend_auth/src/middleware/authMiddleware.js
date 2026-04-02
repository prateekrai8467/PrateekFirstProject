/* src/middleware/authMiddleware.js */
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user data (id and role) to the request object
            req.user = decoded;
            
            next(); // Move to the next middleware or controller
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };