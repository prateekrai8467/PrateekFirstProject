/* src/controller/bookingController.js */
const db = require('../config/db');

exports.createBooking = async (req, res) => {
    const connection = await db.getConnection(); // Use connection for Transaction
    try {
        await connection.beginTransaction();

        const { user_id, room_id, booking_date, start_time, end_time, purpose, resources } = req.body;

        // Smart Conflict Detection: Check if the room is already booked for overlapping time
        const [conflicts] = await connection.execute(
            `SELECT booking_id FROM bookings 
             WHERE room_id = ? 
               AND booking_date = ? 
               AND status IN ('pending', 'approved') 
               AND (start_time < ? AND end_time > ?)`,
            [room_id, booking_date, end_time, start_time]
        );

        if (conflicts.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: "Conflict: Room is already booked for the selected time." });
        }

        // 1. Insert into bookings table
        const [bookingResult] = await connection.execute(
            `INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, room_id, booking_date, start_time, end_time, purpose]
        );

        const bookingId = bookingResult.insertId;

        // 2. If resources (equipment) are requested, link them
        if (resources && resources.length > 0) {
            // Check availability for all requested resources before allocating
            for (let item of resources) {
                const [resDetails] = await connection.execute(
                    `SELECT resource_name, total_quantity FROM resources WHERE resource_id = ?`, 
                    [item.resource_id]
                );
                
                if (resDetails.length === 0) continue;
                
                const totalQuantity = resDetails[0].total_quantity;
                const resourceName = resDetails[0].resource_name;

                // Calculate how many are allocated during this specific time slot
                const [allocations] = await connection.execute(
                    `SELECT COALESCE(SUM(br.quantity_used), 0) as allocated 
                     FROM booking_resources br 
                     JOIN bookings b ON br.booking_id = b.booking_id 
                     WHERE br.resource_id = ? 
                       AND b.booking_date = ? 
                       AND b.status IN ('pending', 'approved') 
                       AND (b.start_time < ? AND b.end_time > ?)`,
                    [item.resource_id, booking_date, end_time, start_time]
                );

                const alreadyAllocated = Number(allocations[0].allocated);
                const available = totalQuantity - alreadyAllocated;

                if (item.quantity > available) {
                    await connection.rollback();
                    return res.status(409).json({ 
                        message: `Resource Conflict: ${resourceName} Quantity = ${totalQuantity}, Already Allocated = ${alreadyAllocated}, User Requests = ${item.quantity}. Available = ${available}. Reject Request.`
                    });
                }
            }

            // Insert approved resources
            for (let item of resources) {
                // Insert into booking_resources (Table 5)
                await connection.execute(
                    `INSERT INTO booking_resources (booking_id, resource_id, quantity_used) VALUES (?, ?, ?)`,
                    [bookingId, item.resource_id, item.quantity]
                );

                // Update available_quantity in resources (Table 3)
                await connection.execute(
                    `UPDATE resources SET available_quantity = GREATEST(0, available_quantity - ?) WHERE resource_id = ?`,
                    [item.quantity, item.resource_id]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: "Booking request submitted", bookingId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Booking failed: " + error.message, error: error.message });
    } finally {
        connection.release();
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [bookings] = await db.execute(
            `SELECT b.*, r.room_number FROM bookings b 
             JOIN rooms r ON b.room_id = r.room_id 
             WHERE b.user_id = ?`, [userId]
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};