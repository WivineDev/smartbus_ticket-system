const fs = require('fs');
const path = require('path');

// Simple logger utility
const logger = (type, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type: type.toUpperCase(),
    message,
    ...(data && { data })
  };

  // Log to console
  console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, data || '');

  // Log to file (in production)
  if (process.env.NODE_ENV === 'production') {
    const logFile = path.join(__dirname, '../../logs', 'app.log');
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
};

// Create logs directory if it doesn't exist
const ensureLogDirectory = () => {
  const logDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// Initialize logger
ensureLogDirectory();

module.exports = {
  info: (message, data) => logger('info', message, data),
  error: (message, data) => logger('error', message, data),
  warn: (message, data) => logger('warn', message, data),
  debug: (message, data) => logger('debug', message, data)
};
