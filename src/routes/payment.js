const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { plan } = req.body;

    let amount;

    if (plan === "silver") amount = 19900; 
    else if (plan === "gold") amount = 49900; 
    else {
      return res.status(400).json({ message: "Invalid plan" });
    }
    
    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        plan,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    await Payment.create({
      userId: user._id,
      orderId: order.id,
      amount,
      currency: "INR",
      plan,
      status: "created",
    });

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("Payment Create Error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

module.exports = paymentRouter;
