const mysql2 = require("mysql2");

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Prateek@8467',
    database: 'room_allocation_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

async function testConnection() {
  try {
    const connection = await pool.promise().getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();

module.exports = pool.promise();
