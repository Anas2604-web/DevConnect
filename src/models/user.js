const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    },
    gender: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        default: []
    },

}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;