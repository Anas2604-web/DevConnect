const swipeLimiter = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const today = new Date().toDateString();

    if (!user.lastSwipeDate || user.lastSwipeDate.toDateString() !== today) {
      user.dailySwipeCount = 0;
      user.lastSwipeDate = new Date();
      await user.save();
    }

    let limit = 20; 

    if (user.premiumPlan === "silver") limit = 50;
    if (user.premiumPlan === "gold") return next();  

    if (user.dailySwipeCount >= limit) {
      return res.status(403).json({
        message: "Daily swipe limit reached 🚫 Upgrade for more swipes."
      });
    }

    user.dailySwipeCount += 1;
    await user.save();

    next();

  } catch (err) {
    res.status(500).json({
      message: "Swipe limiter error",
      error: err.message
    });
  }
};

module.exports = swipeLimiter;