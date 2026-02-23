const { Resend } = require('resend');
require('dotenv').config();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('❌ Resend API key not found in environment variables');
      return false;
    }
    console.log('✅ Resend email service is ready to send messages');
    return true;
  } catch (error) {
    console.log('❌ Email server configuration error:', error);
    return false;
  }
};

// Initialize email service
verifyEmailConfig();

/**
 * Send email function
 * @param {Object} mailOptions - Email options
 * @param {string} mailOptions.to - Recipient email
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.html - HTML content
 */
const sendEmail = async (mailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [mailOptions.to],
      subject: mailOptions.subject,
      html: mailOptions.html
    });

    if (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, resend };
