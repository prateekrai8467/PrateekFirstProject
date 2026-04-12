/* src/controller/authController.js */
const User = require('../models/userModels'); 
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {
        let { name, email, password, role, phone } = req.body;
        
        // Prevent undefined error by defaulting strictly to null
        phone = phone || null;

        // 1. Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Hash password using the utility function
        // REMOVED: Redundant salt and bcrypt.hash calls that were here before
        const hashedPassword = await hashPassword(password);

        // 3. Create user in DB
        await User.create(name, email, hashedPassword, role, phone);
        
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2. Compare password using the utility function
        // CHANGED: Using comparePassword from utils instead of direct bcrypt.compare
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Generate JWT Token using the utility function
        // CHANGED: Using generateToken(id, role) from utils for cleaner code
        const token = generateToken(user.user_id, user.role);

        // 4. Send response
        res.json({
            token,
            role: user.role, 
            name: user.name,
            userId: user.user_id
        });
    } catch (error) {
        res.status(500).json({ message: "Login Error", error: error.message });
    }
};