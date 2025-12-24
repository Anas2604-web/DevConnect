const rateLimit = require("express-rate-limit");

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many password change attempts. Please try again after 15 minutes."
  }
});

module.exports = {
  passwordChangeLimiter
};
