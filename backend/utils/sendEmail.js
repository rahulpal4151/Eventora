import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html: message,
  });
};

export default sendEmail;