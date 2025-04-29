const validator = require('validator');

// Email Validation
const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  return {
    isValid: true
  };
};

// Password Validation
const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  // Optional: Add more password complexity checks
  if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
    return {
      isValid: false,
      error: 'Password must include uppercase, lowercase, number, and special character'
    };
  }

  return {
    isValid: true
  };
};

// Name Validation
const validateName = (name, minLength = 2) => {
  if (!name) {
    return {
      isValid: false,
      error: 'Name is required'
    };
  }

  if (name.length < minLength) {
    return {
      isValid: false,
      error: `Name must be at least ${minLength} characters long`
    };
  }

  return {
    isValid: true
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName
};