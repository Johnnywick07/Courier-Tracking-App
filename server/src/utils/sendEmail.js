import nodemailer from "nodemailer";

/**
 * Sends an email via Gmail SMTP.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  // Built here (not at module load time) so EMAIL_USER/EMAIL_PASS are
  // guaranteed to already be loaded from .env by the time this runs.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Courier Tracking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;