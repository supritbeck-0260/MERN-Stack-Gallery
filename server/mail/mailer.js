const nodemailer = require('nodemailer');
require('dotenv/config');
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD
  }
});

module.exports = mailer;