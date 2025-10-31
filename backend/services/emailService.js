const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // fallback transporter that uses console logging
  transporter = {
    sendMail: async (mailOptions) => {
      console.log("--- Email fallback (logged) ---");
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Text:", mailOptions.text);
      console.log("HTML:", mailOptions.html);
      console.log("-------------------------------");
      return Promise.resolve();
    },
  };
}

const sendReminderEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.SMTP_USER || "no-reply@todo-reminders.local",
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendReminderEmail };
