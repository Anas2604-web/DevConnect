 const express = require('express');
 const connectDB = require("./config/database");
 const User = require("./models/user");
 const validateSignUp = require("./utils/validation");
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 const cookieParser = require('cookie-parser');

 const app = express();

 app.use(cookieParser());
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

 app.post("/login", async(req,res)=> {
   try {
         const {email, password} = req.body;

         const user = await User.findOne({email});
         if(!user) {
           throw new Error("Invalid credentials");
         }

         const isPasswordValid = await bcrypt.compare(password, user.password);

         if(isPasswordValid) {
           const token = await jwt.sign({_id: user._id}, "DEV@Op&8788");

           res.cookie("token", token);

           res.send("Login successful");
         }
         else {
           throw new Error("Invalid credentials");
         }
          
   }
   catch(err) {
      res.status(500).send("Error during login");
   } 
 })

 app.get("/profile", async(req,res) => {
     try {
         const cookies = req.cookies;
          const {token} = cookies;
            if(!token) {
               return res.status(401).send("Unauthorized: No token provided");
            }

          const decoded = jwt.verify(token, "DEV@Op&8788");
            const userId = decoded._id;
            console.log(userId);

            const user = await User.findById(userId).select("-password -__v");
            if(!user) {
               return res.status(404).send("User not found");
            }
            res.json(user);


     }
     catch(err) {
         res.status(500).send("Error fetching profile");
     }
 })

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

 