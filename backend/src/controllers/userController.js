const { sendEmail } = require('../config/email');

// Contact form submission
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Send contact email to admin
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@smartbus.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p><em>This message was sent from the SmartBus contact form.</em></p>
        </div>
      `
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'SmartBus - We received your message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting SmartBus!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>Best regards,<br>SmartBus Team</p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get available routes
const getRoutes = async (req, res) => {
  try {
    const { departure, destination } = req.query;
    const Route = require('../models/Route');

    let result;
    
    if (departure && destination) {
      // Search routes
      result = await Route.search(departure, destination);
    } else {
      // Get all routes
      result = await Route.getAll();
    }

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
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get route by ID
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const Route = require('../models/Route');
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  submitContact,
  getRoutes,
  getRouteById
};
