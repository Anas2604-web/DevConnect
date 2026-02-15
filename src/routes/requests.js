const express = require("express");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionSchema");
const User = require("../models/user");
const requestRouter = express.Router();
const { sendEmail } = require("../utils/sendEmail");


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

        
       if (status === "interested") {
          await sendEmail(
            toUser.email,  
            "New Interest on DevConnect 👀",
            `<h2>${req.user.firstName} is interested in you!</h2>
            <p>Login to check the profile.</p>`
          );
}


        const messageMap = {
        interested: "Interest sent - we’ll notify you if it’s mutual ✨",
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

       if (status === "accepted") {
          const fromUser = await User.findById(connectionRequest.fromUserId);

            if (fromUser?.email) {
              await sendEmail(
                fromUser.email,
                "Your DevConnect Request Was Accepted 🎉",
                `<h2>${loggedInUser.firstName} accepted your request!</h2>
                <p>Start chatting and building connections 🚀</p>`
              );
            }
}
       
       res.json({
        message: `Connection request ${status} successfully`,
        data,
       })

  }
  catch(err) {
        res.status(400).send("ERROR" + err.message); 
  }
})


requestRouter.post("/test-mail", async (req, res) => {
  try {
    await sendEmail(
      "annaasskhan6@gmail.com",
      "DevConnect SES Test 🚀",
      "<h2>SES is working brooo 🎉</h2>"
    );

    res.send("Email sent!");
  } catch (err) {
    res.status(500).send("Failed to send email");
  }
});

module.exports = requestRouter