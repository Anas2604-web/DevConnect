const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const params = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: message },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const response = await ses.send(command);

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

module.exports = { sendEmail };
