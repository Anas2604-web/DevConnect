const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUp = require("./utils/validation");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(cookieParser());
app.use(express.json());

// SIGNUP
app.post("/signup", async (req, res) => {
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

// LOGIN
app.post("/login", async (req, res) => {
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

// PROFILE
app.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

// PATCH
app.patch("/user/:userId", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(500).send("Error updating user");
  }
});

// FEED
app.get("/feed", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// START SERVER
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("Database connection failed", err));
