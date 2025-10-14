 const express = require('express');
 const connectDB = require("./config/database");
 const User = require("./models/user");
 const validateSignUp = require("./utils/validation");
 const bcrypt = require('bcrypt');

 const app = express();

 app.use(express.json());

 app.post("/signup",async(req,res)=>{
     try {
      validateSignUp(req);
       const {firstName, lastName, email, password, age, gender, city, about} = req.body;
       
       const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
         firstName,
         lastName,
         email,
         password:passwordHash,
         age,
         gender,
         city,
         about
     });
     await user.save();
     res.send("User signed up successfully");
     }
    catch(err) {
      console.error(err);
      res.status(500).send(err.message);
   }

 });

 app.patch("/user/:userId", async(req,res) => {
     try {
         const data = req.body;
         const userId = req.params.userId;
         
         const op = await User.findByIdAndUpdate(userId, data, {new: true});
         res.send(op);
     }
     catch {
         res.status(500).send("Error updating user");
     }
 })

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

 