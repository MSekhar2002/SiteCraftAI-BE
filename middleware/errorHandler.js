// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error for development
    console.error(err);
  
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input data',
        errors
      });
    }
  
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      return res.status(400).json({
        status: 'error',
        message: `Duplicate field value: ${value}. Please use another value!`
      });
    }
  
    // JWT Invalid Token Error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again!'
      });
    }
  
    // JWT Expired Token Error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.'
      });
    }
  
    // Default error response
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message || 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;