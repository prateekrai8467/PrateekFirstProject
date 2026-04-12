const mysql = require('mysql2');
const pool = mysql.createPool({host: 'localhost', user: 'root', password: 'Prateek@8467', database: 'room_allocation_system'});

async function check() {
  const [rows] = await pool.promise().query("SELECT b.booking_id, b.status, r.room_number, u.name as user_name FROM bookings b JOIN rooms r ON b.room_id = r.room_id JOIN users u ON b.user_id = u.user_id WHERE u.name LIKE '%Aman%'");
  console.log("Bookings for Aman:");
  console.log(rows);
  
  const [users] = await pool.promise().query("SELECT * FROM users WHERE name LIKE '%Aman%'");
  console.log("User details for Aman:");
  console.log(users);

  process.exit(0);
}
check();
