const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_SEND_API_KEY,
});

const MAILER_SEND_EMAIL_ID = process.env.MAILER_SEND_EMAIL_ID;
const MAILER_SEND_SENDER_NAME = process.env.MAILER_SEND_SENDER_NAME;
const sendPasswordResetEmail = async (recipient, resetPasswordLink) => {
  try {
    const sentFrom = new Sender(MAILER_SEND_EMAIL_ID, MAILER_SEND_SENDER_NAME);
    const sentTo = [new Recipient(recipient?.email, recipient?.username)];
    const personalization = [
      {
        email: recipient?.email,
        data: {
          name: recipient?.username,
          resetPasswordLink,
        },
      },
    ];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(sentTo)
      .setReplyTo(sentFrom)
      .setPersonalization(personalization)
      .setSubject("Forgot Password")
      .setTemplateId("z86org8k97ngew13");

    const res = await mailerSend.email.send(emailParams);
    return res;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = {
  sendPasswordResetEmail,
};
