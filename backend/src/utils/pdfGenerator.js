const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF ticket for a booking
 * @param {Object} booking - Booking details
 * @returns {Promise<string>} - Path to the generated PDF
 */
const generateTicketPDF = (booking) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const filename = `ticket_${booking.id || Date.now()}.pdf`;
            const reportsDir = path.join(__dirname, '../../temp/tickets');

            // Ensure directory exists
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const filePath = path.join(reportsDir, filename);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fillColor('#0284c7').fontSize(25).text('SmartTicket Rwanda', { align: 'center' });
            doc.moveDown();
            doc.fillColor('#444444').fontSize(14).text('OFFICIAL TRAVEL TICKET', { align: 'center', underline: true });
            doc.moveDown(2);

            // Ticket Info
            doc.fontSize(12).fillColor('#333333');

            const leftColX = 50;
            const rightColX = 300;
            let currentY = doc.y;

            // Passenger Details
            doc.font('Helvetica-Bold').text('PASSENGER DETAILS', leftColX, currentY);
            doc.moveDown(0.5);
            doc.font('Helvetica').text(`Name: ${booking.fullName}`, leftColX);
            doc.text(`Email: ${booking.email}`, leftColX);
            doc.text(`Phone: ${booking.phoneNumber}`, leftColX);

            // Trip Details
            doc.font('Helvetica-Bold').text('TRIP DETAILS', rightColX, currentY);
            doc.moveDown(0.5);
            doc.font('Helvetica').text(`From: ${booking.departureLocation}`, rightColX);
            doc.text(`To: ${booking.destination}`, rightColX);
            doc.text(`Date: ${new Date(booking.travelDate).toLocaleDateString()}`, rightColX);
            doc.text(`Class: ${booking.ticketType.toUpperCase()}`, rightColX);

            doc.moveDown(3);

            // Pricing
            doc.font('Helvetica-Bold').fontSize(14).text('PAYMENT SUMMARY', leftColX);
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(12).text(`Total Amount Paid: ${booking.totalPrice || 'N/A'} RWF`, leftColX);
            doc.text(`Booking Status: ${booking.status.toUpperCase()}`, leftColX);

            // Footer
            doc.moveDown(4);
            doc.fontSize(10).fillColor('#888888').text('Thank you for choosing SmartTicket Rwanda. Please present this PDF (digital or printed) during boarding.', { align: 'center' });
            doc.text('For support: support@smartticket.rw | +250 788 000 000', { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateTicketPDF };
