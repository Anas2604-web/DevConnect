const express = require("express");
const validateSignUp = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req.body);

    const { firstName, lastName, email, password, age, gender, city, about } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      city,
      about,
    });

    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (!user) return res.status(401).send("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ _id: user._id }, "DEV@Op&8788");
    res.cookie("token", token, { httpOnly: true });

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error during login");
  }
});

module.exports = authRouter