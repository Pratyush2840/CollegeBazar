import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App password and not the regular password
  }
});

const sendMail = async (to, subject, html, text = '') => {

  try {

    const info = await transporter.sendMail({
      from: `"CollegeBazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    });

    console.log('Email sent:', info.messageId);
    return info;

  } 
  catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }

};

export default sendMail;
