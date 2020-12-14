const jwt = require('jsonwebtoken');
const mailer = require('./mailer');
require('dotenv/config');
const passwordReset = async (user) =>{
    let token;
    token = jwt.sign({userID:user.id},process.env.SECRET_KEY,{expiresIn:'1h'});
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: user.email,
        subject: 'Password Reset',
        html: `<h1> Hi ${user.name}</h1>, </br><p>Please click on the link to reset your password.</p>
        </br>${process.env.CLIENT_URL}/password/${token}`
      };
      return mailer.sendMail(mailOptions);
}

module.exports =  passwordReset;
