n# SmartBus Ticket System

A modern, responsive frontend-only bus ticket booking system built with React, JSX, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with mobile-first approach
- **Easy Navigation**: Intuitive navigation bar with mobile hamburger menu
- **Ticket Booking**: Complete booking form with client-side validation
- **Email Integration**: EmailJS integration for booking notifications and contact forms
- **Multiple Pages**: Home, Booking, About, and Contact pages
- **Reusable Components**: Modular React components for maintainability

## Pages

### 1. Home Page
- Hero section with call-to-action
- Features showcase
- Responsive design
- Navigation to all pages

### 2. Ticket Booking Page
- Comprehensive booking form with:
  - Full Name, Email, Phone Number
  - Departure & Destination locations
  - Travel date picker
  - Ticket type selection
- Client-side validation
- EmailJS integration for sending booking details
- Success/error notifications

### 3. About Page
- Company information and story
- Mission and vision
- Core values
- Statistics and impact metrics

### 4. Contact Page
- Contact information display
- Contact form with validation
- EmailJS integration for messages
- Social media links

## Technology Stack

- **React 18.2.0** - Frontend framework
- **React Router 6.8.0** - Client-side routing
- **Tailwind CSS 3.2.7** - Utility-first CSS framework
- **EmailJS 3.2.0** - Email service integration
- **React Scripts 5.0.1** - Build tooling

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartbus_ticket-system
```

2. Navigate to the frontend folder:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## EmailJS Configuration

To enable email functionality, you need to configure EmailJS:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create email templates for:
   - Booking notifications
   - Contact form messages
4. Update the EmailJS configuration in:
   - `src/pages/Booking.js` (booking form)
   - `src/pages/Contact.js` (contact form)

Replace the placeholder values:
- `your_service_id` - Your EmailJS service ID
- `your_booking_template_id` - Template ID for booking emails
- `your_contact_template_id` - Template ID for contact emails
- `your_user_id` - Your EmailJS user ID
- `your-email@example.com` - Your receiving email address

## Project Structure

```
smartbus_ticket-system/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alert.js
│   │   │   ├── Button.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   └── Input.js
│   │   ├── pages/
│   │   │   ├── About.js
│   │   │   ├── Booking.js
│   │   │   ├── Contact.js
│   │   │   └── Home.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
├── README.md
└── LICENSE
```

## Features Implemented

### Responsive Design
- Mobile-first approach
- Responsive navigation with hamburger menu
- Flexible grid layouts
- Optimized for all screen sizes

### Form Validation
- Real-time validation feedback
- Email format validation
- Phone number validation
- Date validation (no past dates)
- Required field validation

### User Experience
- Loading states during form submission
- Success and error notifications
- Smooth transitions and hover effects
- Accessible semantic HTML
- ARIA labels for screen readers

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Note

This is a frontend-only demonstration. In a production environment, you would need:
- Backend API for ticket management
- Database for storing bookings
- Payment gateway integration
- User authentication system
- Real-time seat selection
- Route management system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for demonstration purposes only.