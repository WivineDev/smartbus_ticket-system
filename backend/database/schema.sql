-- SmartBus Ticket System Database Schema
-- MySQL Database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS smartbus_db;
USE smartbus_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance DECIMAL(10, 2),
    estimated_time TIME,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_departure (departure_location),
    INDEX idx_destination (destination),
    INDEX idx_price (base_price)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    departure_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    travel_date DATE NOT NULL,
    ticket_type ENUM('economy', 'business', 'premium') DEFAULT 'economy',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_travel_date (travel_date),
    INDEX idx_status (status),
    INDEX idx_departure_dest (departure_location, destination)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (full_name, email, password, phone_number, role) 
VALUES ('System Admin', 'admin@smartbus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFUpO', '+1234567890', 'admin');

-- Insert sample routes
INSERT IGNORE INTO routes (departure_location, destination, distance, estimated_time, base_price) VALUES
('New York', 'Boston', 215, '04:30:00', 45.00),
('New York', 'Washington DC', 225, '04:00:00', 35.00),
('New York', 'Philadelphia', 95, '02:00:00', 25.00),
('Boston', 'New York', 215, '04:30:00', 45.00),
('Boston', 'Philadelphia', 310, '05:30:00', 55.00),
('Washington DC', 'New York', 225, '04:00:00', 35.00),
('Washington DC', 'Philadelphia', 140, '03:00:00', 30.00),
('Philadelphia', 'New York', 95, '02:00:00', 25.00),
('Philadelphia', 'Boston', 310, '05:30:00', 55.00),
('Philadelphia', 'Washington DC', 140, '03:00:00', 30.00),
('Los Angeles', 'San Francisco', 383, '06:00:00', 65.00),
('Los Angeles', 'San Diego', 120, '02:30:00', 20.00),
('Los Angeles', 'Las Vegas', 270, '04:00:00', 40.00),
('San Francisco', 'Los Angeles', 383, '06:00:00', 65.00),
('San Francisco', 'San Diego', 508, '08:00:00', 85.00),
('San Diego', 'Los Angeles', 120, '02:30:00', 20.00),
('San Diego', 'San Francisco', 508, '08:00:00', 85.00),
('Las Vegas', 'Los Angeles', 270, '04:00:00', 40.00),
('Las Vegas', 'San Francisco', 570, '09:00:00', 95.00),
('Chicago', 'Detroit', 280, '05:00:00', 50.00),
('Chicago', 'Milwaukee', 92, '01:30:00', 15.00),
('Chicago', 'Indianapolis', 185, '03:00:00', 30.00),
('Detroit', 'Chicago', 280, '05:00:00', 50.00),
('Detroit', 'Cleveland', 170, '03:00:00', 25.00),
('Milwaukee', 'Chicago', 92, '01:30:00', 15.00),
('Indianapolis', 'Chicago', 185, '03:00:00', 30.00),
('Cleveland', 'Detroit', 170, '03:00:00', 25.00);

-- Create view for booking statistics
CREATE OR REPLACE VIEW booking_stats AS
SELECT 
    DATE(created_at) as booking_date,
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
    SUM(total_price) as total_revenue,
    AVG(total_price) as avg_ticket_price
FROM bookings 
GROUP BY DATE(created_at)
ORDER BY booking_date DESC;
