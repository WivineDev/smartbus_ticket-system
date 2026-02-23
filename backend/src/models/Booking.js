const db = require('../config/database');

class Booking {
  // Create new booking
  static async create(bookingData) {
    try {
      const { 
        userId, 
        fullName, 
        email, 
        phoneNumber, 
        departureLocation, 
        destination, 
        travelDate, 
        ticketType,
        status = 'confirmed'
      } = bookingData;
      
      const [result] = await db.execute(
        `INSERT INTO bookings 
         (user_id, full_name, email, phone_number, departure_location, destination, travel_date, ticket_type, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [userId, fullName, email, phoneNumber, departureLocation, destination, travelDate, ticketType, status]
      );
      
      return { success: true, bookingId: result.insertId };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Get booking by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM bookings WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding booking by ID:', error);
      return null;
    }
  }

  // Get bookings by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      return { success: true, bookings: rows };
    } catch (error) {
      console.error('Error getting bookings by user ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all bookings (admin only)
  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM bookings ORDER BY created_at DESC'
      );
      
      return { success: true, bookings: rows };
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return { success: false, error: error.message };
    }
  }

  // Update booking
  static async update(id, bookingData) {
    try {
      const { 
        fullName, 
        email, 
        phoneNumber, 
        departureLocation, 
        destination, 
        travelDate, 
        ticketType,
        status
      } = bookingData;
      
      const [result] = await db.execute(
        `UPDATE bookings 
         SET full_name = ?, email = ?, phone_number = ?, departure_location = ?, 
             destination = ?, travel_date = ?, ticket_type = ?, status = ? 
         WHERE id = ?`,
        [fullName, email, phoneNumber, departureLocation, destination, travelDate, ticketType, status, id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete booking
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM bookings WHERE id = ?',
        [id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Get booking statistics
  static async getStats() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
          COUNT(DISTINCT user_id) as unique_customers,
          SUM(CASE WHEN ticket_type = 'economy' THEN 1 ELSE 0 END) as economy_tickets,
          SUM(CASE WHEN ticket_type = 'business' THEN 1 ELSE 0 END) as business_tickets,
          SUM(CASE WHEN ticket_type = 'premium' THEN 1 ELSE 0 END) as premium_tickets
        FROM bookings
      `);
      
      return { success: true, stats: rows[0] };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Booking;
