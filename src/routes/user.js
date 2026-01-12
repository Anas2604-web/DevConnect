const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionSchema");
const User = require("../models/user");
const userRouter = express.Router();
const calculateMatchScore = require("../utils/matchScore");

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
      .populate("fromUserId", "firstName lastName photoUrl about gender age city skills")
      .populate("toUserId", "firstName lastName photoUrl about gender age city skills")
      .lean();

    const data = requests
      .map((row) => {
        if (!row.fromUserId || !row.toUserId) return null;

        return row.fromUserId._id.toString() === loggedInUser._id.toString()
          ? row.toUserId
          : row.fromUserId;
      })
      .filter(Boolean);

    res.json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch connections",
      error: err.message,
    });
  }
});


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit>50 ? 50 : limit;

    const skip = (page-1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    const hiddenUserIds = new Set();

    for (const request of requests) {
      hiddenUserIds.add(request.fromUserId.toString());
      hiddenUserIds.add(request.toUserId.toString());
    }

    const users = await User.find({
      _id: {
        $nin: [...hiddenUserIds, loggedInUserId]
      }
    }).select(" firstName lastName photoUrl about gender age city skills ")
    .skip(skip)
    .limit(limit)
    .lean();

    const usersWithScore = users.map(user => {
    const { matchScore, reasons } = calculateMatchScore(req.user, user);

    return {
      ...user,
      matchScore,
      reasons
     };
   });

    usersWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(usersWithScore);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch feed",
      error: err.message
    });
  }
});


module.exports = userRouter