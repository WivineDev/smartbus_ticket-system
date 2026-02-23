const Booking = require('../models/Booking');
const { generateTicketPDF } = require('../utils/pdfGenerator');
const { sendBookingConfirmation } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');
const { sendEmail } = require('../config/email');

// Calculate ticket price based on type
const calculateTicketPrice = (basePrice, ticketType) => {
  const priceMultipliers = {
    economy: 1.0,
    business: 1.5,
    premium: 2.0
  };

  return basePrice * (priceMultipliers[ticketType] || 1.0);
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      departureLocation,
      destination,
      travelDate,
      ticketType
    } = req.body;

    // Get base price (default for Rwanda)
    const basePrice = 2500.00;
    const totalPrice = calculateTicketPrice(basePrice, ticketType);

    // Create booking
    const result = await Booking.create({
      userId: req.user ? req.user.id : null,
      fullName,
      email,
      phoneNumber,
      departureLocation,
      destination,
      travelDate,
      ticketType,
      totalPrice
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: result.error
      });
    }

    // Background tasks: Generate PDF and Send Email
    // We don't want to block the response
    const bookingDetails = {
      id: result.bookingId,
      fullName,
      email,
      phoneNumber,
      departureLocation,
      destination,
      travelDate,
      ticketType,
      totalPrice,
      status: 'confirmed'
    };

    try {
      const pdfPath = await generateTicketPDF(bookingDetails);
      await sendBookingConfirmation(bookingDetails, pdfPath);
    } catch (bgError) {
      console.error('❌ Background task error (PDF/Email):', bgError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: result.bookingId,
        totalPrice: totalPrice
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during booking creation'
    });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Booking.findByUserId(userId);

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
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update booking
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

    // Check if user owns this booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = req.body;

    // Recalculate price if ticket type changed
    if (updateData.ticketType && updateData.ticketType !== booking.ticket_type) {
      const basePrice = 25.00; // Default base price
      updateData.totalPrice = calculateTicketPrice(basePrice, updateData.ticketType);
    }

    const result = await Booking.update(id, updateData);

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

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled (e.g., not too close to travel date)
    const travelDate = new Date(booking.travel_date);
    const today = new Date();
    const daysUntilTravel = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilTravel < 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 24 hours before travel date'
      });
    }

    const result = await Booking.update(id, { status: 'cancelled' });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel booking',
        error: result.error
      });
    }

    // Send cancellation email
    await sendEmail({
      to: booking.email,
      subject: 'SmartBus Booking Cancellation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Booking Cancelled</h2>
          <p>Dear ${booking.full_name},</p>
          <p>Your SmartBus booking has been cancelled as requested.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Cancelled Booking Details:</h3>
            <p><strong>Booking ID:</strong> #${id}</p>
            <p><strong>Departure:</strong> ${booking.departure_location}</p>
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Travel Date:</strong> ${new Date(booking.travel_date).toLocaleDateString()}</p>
          </div>
          
          <p>If you did not request this cancellation, please contact our support team immediately.</p>
          <p>Best regards,<br>SmartBus Team</p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Download ticket PDF
const downloadTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // PDF filename convention from pdfGenerator.js
    const filename = `ticket_${id}.pdf`;
    const filePath = path.join(__dirname, '../../temp/tickets', filename);

    if (fs.existsSync(filePath)) {
      res.download(filePath, `SmartTicket_${id}.pdf`);
    } else {
      // If file doesn't exist, regenerate it
      try {
        const newPath = await generateTicketPDF(booking);
        res.download(newPath, `SmartTicket_${id}.pdf`);
      } catch (genError) {
        console.error('Error regenerating ticket PDF for download:', genError);
        res.status(404).json({
          success: false,
          message: 'Ticket file not found and could not be regenerated.'
        });
      }
    }
  } catch (error) {
    console.error('Download ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while downloading ticket'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  downloadTicket
};
