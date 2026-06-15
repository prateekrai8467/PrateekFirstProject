/* root/server.js */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Import all routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const resourceRoutes = require('./src/routes/resourcesRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const allocationRoutes = require('./src/routes/allocationRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Global Middleware
app.use(cors()); // Allows frontend access
app.use(express.json()); // Parses incoming JSON requests

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/allocations', allocationRoutes);

// Root Route (for testing if server is alive)
app.get('/', (req, res) => {
    res.send('Resource Management System API is running...');
});

// Custom Error Handling Middleware (Must be last)
app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server instead of using app.listen directly
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this in production to specific frontend domains
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible in controllers
app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('🔗 Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`
    🚀 Server is flying on port ${PORT}
    📂 Mode: ${process.env.NODE_ENV}
    🔗 URL: http://localhost:${PORT}
    📡 WebSocket is active
    `);
});