// utils/email.js
import nodemailer from 'nodemailer';

export const sendBookingConfirmation = async (toEmail, sitterName, userName, date) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Sits17" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'New Booking Confirmation',
    text: `Hi ${sitterName},\n\nYou’ve been booked by ${userName} on ${new Date(date).toLocaleString()}.\n\nPlease login to your dashboard to view details.\n\nThanks,\nSits17 Team`,
  };

  await transporter.sendMail(mailOptions);
};
