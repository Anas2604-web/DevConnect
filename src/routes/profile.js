const express = require("express");
const { userAuth } = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = profileRouter