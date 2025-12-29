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

        const existingConnectionRequest = await ConnectionRequest.find({
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

        res.json({
          message:"Connection Req sent",
          data,
        })
    }
    catch(err) {
        res.status(400).send("ERROR" + err.message);
    }
})

module.exports = requestRouter