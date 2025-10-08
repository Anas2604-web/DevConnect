 const express = require('express');
 const connectDB = require("./config/database");
 const User = require("./models/user");

 const app = express();

 app.use(express.json());

 app.post("/signup",async(req,res)=>{
     try {
     const user = new User(req.body);
     console.log(req.body);
     await user.save();
     res.send("User signed up successfully");
     }
    catch(err) {
           res.status(500).send("Error signing up user");
     }
   
 });

 app.get("/feed", async(req,res) => {
    try {
       const users = await User.find();
       res.json(users);
    }
    catch(err) {
       res.status(500).send("Error fetching users");
    }
 });

 connectDB()
 .then(() => {
    console.log("Database connected");
    app.listen(5000, ()=> {
    console.log(`Server is running on port 5000 `);
 });
 })
    .catch((err) => {
        console.log("Database connection failed", err);
    });

 