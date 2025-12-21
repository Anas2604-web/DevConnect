const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use(cookieParser());
app.use(express.json());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("Database connection failed", err));
