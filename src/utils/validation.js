const validator = require('validator');

const validateSignUp = (body) => {
  const { firstName, lastName, email, password } = body;

  if (!firstName || firstName.length < 2 || firstName.length > 30) {
    throw new Error("First name must be 2–30 characters.");
  }

  if (lastName && (lastName.length < 2 || lastName.length > 30)) {
    throw new Error("Last name must be 2–30 characters.");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong.");
  }

  return true;
};

const validateEditProfileData = (req) => {
  const AllowedEditFields = ["firstName", "lastName", "age", "city", "skills", "photoUrl", "about", "city", "gender"];
     return Object.keys(req.body).every(field =>
         AllowedEditFields.includes(field));
}

module.exports = {
  validateSignUp,
  validateEditProfileData,
};
