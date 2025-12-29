const express = require("express");
const { validateSignUp }= require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const validator = require("validator");



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

    const token = jwt.sign({ _id: user._id }, "DEV@Op&8788", {
      expiresIn:"7d",
    });
    res.cookie("token", token, { httpOnly: true , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error during login");
  }
});

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, { 
       expires: new Date(Date.now())
      });
      res.send("Logout Successful");
})

authRouter.post("/forgot-password", async (req, res) => {
  try {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if(user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("Reset link:", resetLink);
  }

  res.send("If account exists, reset link has been sent");
 }
 catch(err) {
  res.status(500).send("Something went wrong");
 }
});

authRouter.post("/reset-password/:token", async (req, res) => {
  try {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Token is invalid or expired");
  }


  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).send("Password not strong enough");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.send("Password reset successful");
}
catch(err) {
  res.status(500).send("Something went wrong");
}
});



module.exports = authRouter