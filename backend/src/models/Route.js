const db = require('../config/database');

class Route {
  // Create new route
  static async create(routeData) {
    try {
      const { departureLocation, destination, distance, estimatedTime, basePrice } = routeData;
      
      const [result] = await db.execute(
        `INSERT INTO routes (departure_location, destination, distance, estimated_time, base_price, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [departureLocation, destination, distance, estimatedTime, basePrice]
      );
      
      return { success: true, routeId: result.insertId };
    } catch (error) {
      console.error('Error creating route:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all routes
  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM routes ORDER BY departure_location, destination'
      );
      
      return { success: true, routes: rows };
    } catch (error) {
      console.error('Error getting all routes:', error);
      return { success: false, error: error.message };
    }
  }

  // Get route by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM routes WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding route by ID:', error);
      return null;
    }
  }

  // Search routes by departure and destination
  static async search(departure, destination) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM routes WHERE departure_location LIKE ? AND destination LIKE ? ORDER BY base_price ASC',
        [`%${departure}%`, `%${destination}%`]
      );
      
      return { success: true, routes: rows };
    } catch (error) {
      console.error('Error searching routes:', error);
      return { success: false, error: error.message };
    }
  }

  // Update route
  static async update(id, routeData) {
    try {
      const { departureLocation, destination, distance, estimatedTime, basePrice } = routeData;
      
      const [result] = await db.execute(
        `UPDATE routes 
         SET departure_location = ?, destination = ?, distance = ?, estimated_time = ?, base_price = ? 
         WHERE id = ?`,
        [departureLocation, destination, distance, estimatedTime, basePrice, id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error updating route:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete route
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM routes WHERE id = ?',
        [id]
      );
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error deleting route:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Route;
