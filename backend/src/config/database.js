const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartbus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Function to check database connection
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 TIP: Make sure your MySQL server (XAMPP/WAMP/MySQL Service) is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`💡 TIP: Database "${dbConfig.database}" does not exist. Please run the schema.sql script.`);
    }
    return false;
  }
};

// Test database connection on startup
checkConnection();

module.exports = {
  pool,
  execute: (...args) => pool.execute(...args),
  query: (...args) => pool.query(...args),
  checkConnection
};
