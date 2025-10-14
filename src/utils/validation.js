const validator = require('validator');

const ValidateSignUp = (req) => {

    const { firstName, lastName, email, password } = req.body;
    if (!firstName || firstName.length < 2 || firstName.length > 30) {
         throw new Error("First name is required and should be between 2 and 30 characters.");
    }
    if (lastName && (lastName.length < 2 || lastName.length > 30)) {
        throw new Error("Last name should be between 2 and 30 characters.");
    }
    if(!email || !validator.isEmail(email)) {
         throw new Error("Please enter a valid email adress");
    }
    if (!password || password.length < 6 || password.length > 100 ) {
         throw new Error("Password is required and should be between 6 and 100 characters.");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong");
    }
}

module.exports = ValidateSignUp;