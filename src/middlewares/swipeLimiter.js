const User = require("../models/user");

const swipeLimiter = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const today = new Date().toDateString();

    if (!user.lastSwipeDate || user.lastSwipeDate.toDateString() !== today) {
      user.dailySwipeCount = 0;
      user.lastSwipeDate = new Date();
      await user.save();
    }

    if (user.premiumPlan === "gold") {
      req.remainingSwipes = "unlimited";
      return next();
    }

    let limit = 9;
    if (user.premiumPlan === "silver") limit = 50;

    if (user.dailySwipeCount >= limit) {
      return res.status(403).json({
        message: "Daily swipe limit reached 🚫 Upgrade for more swipes."
      });
    }

    user.dailySwipeCount += 1;
    await user.save();

    req.remainingSwipes = limit - user.dailySwipeCount;

    next();

  } catch (err) {
    res.status(500).json({
      message: "Swipe limiter error",
      error: err.message
    });
  }
};

module.exports = swipeLimiter;