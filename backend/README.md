# SmartBus Backend API

A comprehensive backend API for the SmartBus Ticket System built with Node.js, Express.js, MySQL, and modern web technologies.

## Features

- **User Authentication**: Register, login, JWT-based authentication
- **Ticket Booking**: Complete booking system with validation and email notifications
- **Admin Panel**: Full admin dashboard with user and booking management
- **Email Integration**: Nodemailer for booking confirmations and notifications
- **RESTful API**: Clean, well-documented REST endpoints
- **Security**: JWT authentication, input validation, CORS enabled
- **Database**: MySQL with proper relationships and indexing

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **dotenv** - Environment variables
- **helmet** - Security headers
- **morgan** - HTTP request logger

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartbus_ticket-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartbus_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@smartbus.com

# Admin Configuration
ADMIN_EMAIL=admin@smartbus.com
ADMIN_PASSWORD=admin123
```

4. Set up the database:
```bash
mysql -u root -p < database/schema.sql
```

5. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Bookings
- `POST /api/bookings` - Create new booking (public)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### Admin (Protected + Admin Role Required)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id` - Update booking
- `DELETE /api/admin/bookings/:id` - Delete booking
- `GET /api/admin/routes` - Get all routes
- `POST /api/admin/routes` - Create new route
- `PUT /api/admin/routes/:id` - Update route
- `DELETE /api/admin/routes/:id` - Delete route

### Public Routes
- `GET /api/users/routes` - Get available routes
- `GET /api/users/routes/:id` - Get route by ID
- `POST /api/users/contact` - Submit contact form

### System
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Table
- `id` - Primary key
- `full_name` - User's full name
- `email` - User's email (unique)
- `password` - Hashed password
- `phone_number` - User's phone number
- `role` - User role (user/admin)
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Bookings Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `full_name` - Passenger's full name
- `email` - Passenger's email
- `phone_number` - Passenger's phone number
- `departure_location` - Departure city/location
- `destination` - Destination city/location
- `travel_date` - Travel date
- `ticket_type` - Ticket type (economy/business/premium)
- `status` - Booking status (pending/confirmed/cancelled/completed)
- `total_price` - Total ticket price
- `created_at` - Booking timestamp
- `updated_at` - Last update timestamp

### Routes Table
- `id` - Primary key
- `departure_location` - Departure city/location
- `destination` - Destination city/location
- `distance` - Distance in miles/km
- `estimated_time` - Estimated travel time
- `base_price` - Base ticket price
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send POST request to `/api/auth/login` with email and password
2. **Receive Token**: Successful login returns a JWT token
3. **Use Token**: Include token in Authorization header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

The API provides consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## Validation

All input data is validated using express-validator:

- **Email validation**: Proper email format
- **Password requirements**: Min 6 characters, uppercase, lowercase, number
- **Phone validation**: Valid phone number format
- **Date validation**: Future dates only for travel dates
- **Required fields**: All required fields are checked

## Email Templates

The system sends automated emails for:

- **Welcome emails**: New user registration
- **Booking confirmations**: Successful ticket bookings
- **Booking cancellations**: Cancelled bookings
- **Contact form submissions**: User inquiries

## Security Features

- **Password hashing**: bcryptjs for secure password storage
- **JWT authentication**: Secure token-based authentication
- **Input validation**: Comprehensive input sanitization
- **CORS enabled**: Cross-origin request handling
- **Security headers**: Helmet.js for additional security
- **Rate limiting**: Protection against brute force attacks

## Development

### Running Tests
```bash
npm test
```

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── database/
│   └── schema.sql       # Database schema
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Production Deployment

1. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=5000
   ```

2. Build and start:
   ```bash
   npm start
   ```

3. Use process manager (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "smartbus-api"
   ```

## Default Admin Account

After setting up the database, a default admin account is created:
- **Email**: admin@smartbus.com
- **Password**: admin123

**Important**: Change the default admin password immediately after first login.

## License

This project is licensed under the MIT License.
