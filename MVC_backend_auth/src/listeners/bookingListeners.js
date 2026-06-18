/* src/listeners/bookingListeners.js */
const eventEmitter = require('../utils/eventEmitter');
const db = require('../config/db');
const { sendBookingDecisionEmail } = require('../utils/emailService');

// ==========================================
// LISTENER 1: Send Email
// ==========================================
eventEmitter.on('booking.approved', async (payload) => {
    const { bookingId, remarks } = payload;
    try {
        console.log(`📧 [Event Listener - Email] Fetching details to notify user for Booking #${bookingId}...`);
        const [userResult] = await db.execute(`
            SELECT u.email, u.name 
            FROM users u
            JOIN bookings b ON u.user_id = b.user_id
            WHERE b.booking_id = ?
        `, [bookingId]);

        if (userResult.length > 0) {
            const user = userResult[0];
            console.log(`📧 [Event Listener - Email] Sending booking decision email to ${user.email}`);
            await sendBookingDecisionEmail(user.email, user.name, bookingId, 'approved', remarks);
        } else {
            console.warn(`⚠️ [Event Listener - Email] User not found for Booking #${bookingId}`);
        }
    } catch (emailErr) {
        console.error(`❌ [Event Listener - Email] Failed to send email:`, emailErr);
    }
});

// ==========================================
// LISTENER 2: Update Inventory (Resource Available Quantity)
// ==========================================
eventEmitter.on('booking.approved', async (payload) => {
    const { bookingId } = payload;
    try {
        console.log(`📦 [Event Listener - Inventory] Updating resource inventory for Booking #${bookingId}...`);
        const [resources] = await db.execute(`
            SELECT resource_id, quantity_used 
            FROM booking_resources 
            WHERE booking_id = ?
        `, [bookingId]);

        if (resources.length > 0) {
            for (const item of resources) {
                console.log(`📦 [Event Listener - Inventory] Decrementing available quantity for Resource ID ${item.resource_id} by ${item.quantity_used}`);
                await db.execute(
                    `UPDATE resources 
                     SET available_quantity = GREATEST(0, available_quantity - ?) 
                     WHERE resource_id = ?`,
                    [item.quantity_used, item.resource_id]
                );
            }
            console.log(`📦 [Event Listener - Inventory] Successfully updated inventory.`);
        } else {
            console.log(`📦 [Event Listener - Inventory] No resources allocated for Booking #${bookingId}`);
        }
    } catch (inventoryErr) {
        console.error(`❌ [Event Listener - Inventory] Failed to update inventory:`, inventoryErr);
    }
});

// ==========================================
// LISTENER 3: Create Log (Audit Log)
// ==========================================
eventEmitter.on('booking.approved', async (payload) => {
    const { bookingId, approvedBy } = payload;
    try {
        console.log(`📝 [Event Listener - AuditLog] Creating audit log entry for Booking #${bookingId}...`);
        const logUserId = approvedBy || null;
        const action = `Booking #${bookingId} was approved`;
        const oldValue = 'pending';
        const newValue = 'approved';

        await db.execute(
            "INSERT INTO audit_logs (user_id, action, old_value, new_value) VALUES (?, ?, ?, ?)",
            [logUserId, action, oldValue, newValue]
        );
        console.log(`📝 [Event Listener - AuditLog] Audit log entry created successfully.`);
    } catch (logErr) {
        console.error(`❌ [Event Listener - AuditLog] Failed to create audit log entry:`, logErr);
    }
});

module.exports = eventEmitter;
