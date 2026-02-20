const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const crypto = require("crypto");
const User = require("../models/user"); 

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

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const paymentRecord = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (paymentRecord.status === "success") {
      return res.status(200).json({ success: true });
    }

    paymentRecord.status = "success";
    paymentRecord.paymentId = razorpay_payment_id;
    paymentRecord.signature = razorpay_signature;
    await paymentRecord.save();

    await User.findByIdAndUpdate(paymentRecord.userId, {
      isPremium: true,
      premiumPlan: paymentRecord.plan,
      premiumActivatedAt: new Date(),
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    console.log("Webhook Event:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const orderId = payment.order_id;

      const paymentRecord = await Payment.findOne({ orderId });

      if (!paymentRecord) {
        console.log("Payment record not found");
        return res.status(400).send("Payment not found");
      }

      if (paymentRecord.status === "success") {
        return res.status(200).json({ success: true });
      }

      paymentRecord.status = "success";
      paymentRecord.paymentId = payment.id;
      await paymentRecord.save();

      await User.findByIdAndUpdate(paymentRecord.userId, {
        isPremium: true,
        premiumPlan: paymentRecord.plan,
        premiumActivatedAt: new Date(),
      });

      console.log("✅ User upgraded via webhook");
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Webhook failed");
  }
});

module.exports = paymentRouter;
