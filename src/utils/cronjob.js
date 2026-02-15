const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionSchema");
const { startOfDay, endOfDay, subDays } = require("date-fns");
const { sendEmail } = require("../utils/sendEmail");

cron.schedule("0 23 * * *", async () => {
  console.log("Running daily reminder cron...");

  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId?.email)),
    ];

    for (const email of listOfEmails) {
      if (!email) continue;

      try {
        await sendEmail(
          email,
          "You Have Pending DevConnect Requests 👀",
          `
          <h2>Don’t miss new connections!</h2>
          <p>You have pending connection requests waiting.</p>
          <p>Login to DevConnect and respond now 🚀</p>
          `
        );
      } catch (err) {
        console.log("Reminder email failed:", email);
      }
    }

    console.log("Daily reminder emails sent");
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
