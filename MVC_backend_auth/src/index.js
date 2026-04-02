/* src/index.js */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const fineRoutes = require('./routes/fineRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Apply Routes to API Paths
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/fines', fineRoutes);
// Must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));