/* src/utils/generateToken.js */
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    // We include the role so the frontend can redirect immediately after login
    return jwt.sign(
        { id: userId, role: role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' } // Token valid for 24 hours
    );
};

module.exports = generateToken;