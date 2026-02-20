const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value)  {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email format");
            }
        }   
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    },
    gender: {
        type: String,
        minlength: 4,
        maxlength: 6,
        validate(value) {
            if(!["male","female","others","other"].includes(value.toLowerCase())) {
              throw new Error("Gender is not valid");
        }
    }
    },
    age: {
        type: Number,
        min: 18,
    },
    city: {
        type: String,
    },
    skills: {
        type: [String],
        default: [],
        validate(value) {
            if(value.length > 10) {
                throw new Error("A user can have a maximum of 10 skills");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(value && !validator.isURL(value)) {
                throw new Error("Invalid URL format");
            }
        }
    },
    about: {
        type: String,
        maxlength: 500,
        default: "This is a default about section."
    },
    isPremium: {
        type: Boolean,
        default: false
        },
        premiumPlan: {
        type: String,
        enum: ["silver", "gold"],
        default: null
    },
    premiumActivatedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;