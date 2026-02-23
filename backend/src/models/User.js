const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    try {
      const { fullName, email, password, phoneNumber, role = 'user' } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const [result] = await db.execute(
        `INSERT INTO users (full_name, email, password, phone_number, role, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [fullName, email, hashedPassword, phoneNumber, role]
      );
      
      return { success: true, userId: result.insertId };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin only)
  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT id, full_name, email, phone_number, role, created_at FROM users ORDER BY created_at DESC'
      );
      
      return { success: true, users: rows };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const { fullName, email, phoneNumber } = userData;
      
      const [result] = await db.execute(
        `UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?`,
        [fullName, email, phoneNumber, id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = User;
