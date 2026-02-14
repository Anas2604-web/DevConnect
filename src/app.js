const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests");
const userRouter = require('./routes/user');

app.use(cors({
  origin: ["http://localhost:5173", "http://52.63.160.20"],
  credentials: true,
}))

app.use(cookieParser());
app.use(express.json());


app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);


connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("Database connection failed", err));
