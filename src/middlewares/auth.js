const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, "DEV@Op&8788");
    const { _id } = decoded;

    const userDoc = await User.findById(_id).select("-password -__v");
    if (!userDoc) {
      return res.status(401).send("Unauthorized: User not found");
    }

    req.user = userDoc;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).send("Unauthorized access");
  }
};

module.exports = { userAuth };
