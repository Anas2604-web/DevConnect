const express = require("express");
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require('bcrypt');
const { passwordChangeLimiter } = require("../middlewares/ratelimiter");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
       res.send(req.user);
  }
  catch(err) {
     res.status(400).send("ERROR : " + err.message);
  }
  
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
       if(!validateEditProfileData(req)) {
          throw new Error("Invalid Edit Request");
       }  
       const loggedInUser = req.user;
       Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

       await loggedInUser.save();

       res.json({
        message :`${loggedInUser.firstName}, your profile updated successfully`,
        data : loggedInUser
  });
  }
  catch(err) {
     res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, passwordChangeLimiter, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new Error("Old password and new password are required");
      }

      const isMatch = await bcrypt.compare(
        oldPassword,
        loggedInUser.password
      );

      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password must be strong");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser.password = hashedPassword;

      await loggedInUser.save();

      res.json({
        message: "Password changed successfully"
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = profileRouter