const nodemailer = require('nodemailer');
const fs = require('fs');

const sendBookingConfirmation = async (booking, pdfPath) => {
    try {
        // Create transporter (Generic fallback for development)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL_USER || 'demo@smartticket.rw',
                pass: process.env.EMAIL_PASS || 'demo123'
            }
        });

        const mailOptions = {
            from: '"SmartTicket Rwanda" <bookings@smartticket.rw>',
            to: booking.email,
            subject: `Booking Confirmation - ${booking.departureLocation} to ${booking.destination}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #0284c7; text-align: center;">SmartTicket Rwanda</h2>
                <p>Hello <strong>${booking.fullName}</strong>,</p>
                <p>Thank you for booking your bus ticket with SmartTicket Rwanda. Your trip is confirmed!</p>
                
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Trip Summary:</h3>
                    <p><strong>From:</strong> ${booking.departureLocation}</p>
                    <p><strong>To:</strong> ${booking.destination}</p>
                    <p><strong>Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
                    <p><strong>Class:</strong> ${booking.ticketType}</p>
                </div>

                <p>Your ticket is attached to this email as a PDF. Please keep it safe for boarding.</p>
                
                <p>Safe Travels,<br>The SmartTicket Rwanda Team</p>
            </div>
        `,
            attachments: [
                {
                    filename: `Ticket_${booking.id}.pdf`,
                    path: pdfPath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email failed to send:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendBookingConfirmation };
