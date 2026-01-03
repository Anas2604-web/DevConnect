const express = require("express");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionSchema");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)) {
           return res.status(400).json({
            message: "Invalid Request"
           })
        }

        const toUser = await User.findById(toUserId);

        if(!toUser) {
            return res.status(400).send("The User doesnt exist");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
          $or: [
          {fromUserId, toUserId},
          {fromUserId : toUserId, toUserId : fromUserId}
          ]
        })

        if(existingConnectionRequest) {
          return res.status(400).send("Connection Request already exist");
        }

        const connectionRequest = new ConnectionRequest ({
          fromUserId,
          toUserId,
          status
        })

        const data = await connectionRequest.save();

        const messageMap = {
        interested: "Interest sent — we’ll notify you if it’s mutual ✨",
        ignored: "Profile skipped. You’re in control."
        };

        res.json({
        message: messageMap[status],
        data
});

    }
    catch(err) {
        res.status(400).send("ERROR" + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
  try {
       const loggedInUser = req.user;
       const {status, requestId} = req.params;

       const allowedStatus = ["accepted", "rejected"];

       if(!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed"
        })
       }

       const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
       })

       if(!connectionRequest) {
        return res.status(400).json({
          message: "Connection Request not found",

        })
       }

       
       connectionRequest.status = status
       
       const data = await connectionRequest.save();
       
       res.json({
        message: `Connection request ${status} successfully`,
        data,
       })

  }
  catch(err) {
        res.status(400).send("ERROR" + err.message); 
  }
})

module.exports = requestRouter