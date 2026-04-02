/* src/utils/calculateCharges.js */

/**
 * Calculates room booking charges
 * @param {string} type - 'lab', 'classroom', 'seminar_hall', etc.
 * @param {number} hours - Duration of the booking
 */
const calculateRoomCharge = (type, hours) => {
    const rates = {
        'classroom': 0,      // Free for students
        'lab': 50,            // ₹50 per hour
        'seminar_hall': 200,  // ₹200 per hour
        'conference_room': 100,
        'library_room': 0
    };

    const rate = rates[type] || 0;
    return (rate * hours).toFixed(2);
};

/**
 * Calculates fine for late returns
 * @param {number} daysLate 
 */
const calculateFine = (daysLate) => {
    const finePerDay = 10.00; // ₹10 fine per day
    return (daysLate * finePerDay).toFixed(2);
};

module.exports = { calculateRoomCharge, calculateFine };