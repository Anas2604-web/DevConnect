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

userRouter.get("/user/connections", userAuth,  async (req,res) => {
    try {
       const loggedInUser = req.user;

       const requests = await ConnectionRequest.find({
        $or: [
        { toUserId: loggedInUser._id, status:  "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
        ]
        })
        .populate(
        "fromUserId", 
        "firstName  lastName  photoUrl  about  gender  age city  skills " )
        .populate(
        "toUserId",
        "firstName  lastName  photoUrl  about  gender  age city  skills " );

        const data = requests.map((row) => {
          if(row.fromUserId === loggedInUser._id) {
            return row.toUserId;
          }
          return row.fromUserId;
        })

        res.json({ data  })
    }
        catch(err) {
          res.status(400).send("ERROR" + err.message);
        }
})

module.exports = userRouter