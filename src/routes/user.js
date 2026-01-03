const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionSchema");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth,  async (req,res) => {
    try {
       const loggedInUser = req.user;

       const requests = await ConnectionRequest.find({
         toUserId: loggedInUser._id,
         status:  "interested", 
       }).populate(
        "fromUserId", 
        "firstName  lastName  photoUrl  about  gender  age city  skills " );

        res.json({
            message: "Data fetched Successfully",
            data : requests,
        })
    }
        catch(err) {
          res.status(400).send("ERROR" + err.message);
        }
})

module.exports = userRouter