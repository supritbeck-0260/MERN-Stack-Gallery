const jwt = require('jsonwebtoken');
require('dotenv/config');
const Profile = require('../Modals/profileInfo');

const authorization = async (req,res,next)=>{

    try {
        const token = req.headers.authorization;
        const user = await jwt.verify(token,process.env.SECRET_KEY);
        const findUser = await Profile.findOne({_id:user.userID});
        req.user = findUser;
        next();

    } catch (error) {
       res.status(201).json({message:'Authentication Failed.'});
    }

}
module.exports = authorization;