const jwt = require('jsonwebtoken');
require('dotenv/config');
const User = require('../Modals/user');

const authorization = async (req,res,next)=>{

    try {
        const token = req.headers.authorization;
        const user = await jwt.verify(token,process.env.SECRET_KEY);
        req.user = User.findOne({_id:user.userID});
        next();

    } catch (error) {
       res.status(201).json({message:'Authentication Failed.'});
    }

}
module.exports = authorization;