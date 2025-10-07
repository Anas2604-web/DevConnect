 const express = require('express');

 const app = express();

 const {adminAuth, userAuth} = require("./middlewares/auth");
 
 app.use("/admin", adminAuth); 

 app.use("/user", userAuth);  

 app.get("/user", userAuth,(req,res,next)=> {
      res.send("op user");op
 })

 app.get("/admin/getData", adminAuth,(req,res) => {
    res.send("Hello from  server");
 })

 app.use("/",(req,res) => {
    res.send("Hello from the op server");
 })

 app.listen(5000, ()=> {
    console.log(`Server is running on port 5000 `);
 });