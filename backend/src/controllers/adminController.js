const User = require('../models/User');
const Booking = require('../models/Booking');
const Route = require('../models/Route');

// Get dashboard statistics
const getDashboard = async (req, res) => {
  try {
    // Get booking statistics
    const bookingStats = await Booking.getStats();
    
    // Get recent bookings
    const recentBookings = await Booking.getAll();
    
    // Get user count
    const allUsers = await User.getAll();
    
    // Get route count
    const allRoutes = await Route.getAll();

    const dashboard = {
      stats: bookingStats.success ? bookingStats.stats : {
        total_bookings: 0,
        confirmed_bookings: 0,
        cancelled_bookings: 0,
        unique_customers: 0,
        economy_tickets: 0,
        business_tickets: 0,
        premium_tickets: 0
      },
      recentBookings: recentBookings.success ? recentBookings.bookings.slice(0, 10) : [],
      totalUsers: allUsers.success ? allUsers.users.length : 0,
      totalRoutes: allRoutes.success ? allRoutes.routes.length : 0
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await User.getAll();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phoneNumber, role } = req.body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email !== existingUser.email) {
      const emailTaken = await User.findByEmail(email);
      if (emailTaken && emailTaken.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    const result = await User.update(id, {
      fullName,
      email,
      phoneNumber,
      role
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: result.error
      });
    }

    // Get updated user data
    const updatedUser = await User.findById(id);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const result = await User.delete(id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const result = await Booking.getAll();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve bookings',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update booking (admin)
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const result = await Booking.update(id, req.body);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update booking',
        error: result.error
      });
    }

    // Get updated booking
    const updatedBooking = await Booking.findById(id);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete booking (admin)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const result = await Booking.delete(id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete booking',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const result = await Route.getAll();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve routes',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.routes
    });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create route
const createRoute = async (req, res) => {
  try {
    const {
      departureLocation,
      destination,
      distance,
      estimatedTime,
      basePrice
    } = req.body;

    const result = await Route.create({
      departureLocation,
      destination,
      distance,
      estimatedTime,
      basePrice
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create route',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: {
        routeId: result.routeId,
        departureLocation,
        destination,
        distance,
        estimatedTime,
        basePrice
      }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const result = await Route.update(id, req.body);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update route',
        error: result.error
      });
    }

    // Get updated route
    const updatedRoute = await Route.findById(id);

    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: updatedRoute
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const result = await Route.delete(id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete route',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute
};
