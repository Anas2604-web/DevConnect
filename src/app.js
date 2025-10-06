 const express = require('express');

 const app = express();
 
 app.use("/test",(req,res) => {
    res.send("Hello from the server");
 }) 

 app.use("/home",(req,res) => {
    res.send("Hello from the server");
 })

 app.use("/",(req,res) => {
    res.send("Hello from the op server");
 })

 app.listen(5000, ()=> {
    console.log(`Server is running on port 5000 `);
 });