const jwt = require('jsonwebtoken');
const mailer = require('../mail/mailer');
require('dotenv/config');
const sender = async (user) =>{
    let token;
    token = jwt.sign({userID:user.id},'The_Key_You_Cant_Guess',{expiresIn:'1h'});
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: user.email,
        subject: 'Email verification',
        html: `<h1> Hi ${user.name}</h1>, </br><p>Please click on the link to verify your email.</p>
        </br>http://localhost:3000/token/${token}`
      };
      return mailer.sendMail(mailOptions);
}

module.exports =  sender;
