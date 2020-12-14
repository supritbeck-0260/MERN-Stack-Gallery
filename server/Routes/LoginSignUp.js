const express = require('express');
const User = require('../Modals/user');
const Profile = require('../Modals/profileInfo');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Notify = require('../Modals/notification');
const sender = require('../mail/send');
const passwordReset = require('../mail/passwordReset');
const authorization = require('../middleware/Authorization');
require('dotenv/config');

router.post('/signup', async (req,res)=>{
    let hashedPassword;
    let existingUser;
    try{
        hashedPassword = await bcrypt.hash(req.body.password,12);
   }catch(err){
       res.status(500).json({message:'Could not create user. Try again.'});
   }
    const {name,email,gender} = {...req.body};
    try{
       existingUser = await User.findOne({email:email});
       if(existingUser && existingUser.status == 'Active'){
        res.status(201).json({message:'This Email ID has already been registered.!'});
       }else if(existingUser && existingUser.status == 'Inactive'){
           try {
            const updatedUser = await User.findByIdAndUpdate({'_id':existingUser.id},{$set:{name:name,email:email,gender:gender,password:hashedPassword}});
              sender({id:updatedUser.id,name:name,email:email}).then(response=>{
                  res.status(200).json({message:'Email sent to '+response.accepted[0]+ '. Please verify your Email ID.'});
              }).catch (error=>{
                    res.status(201).json({message:'Falied to Sign up. Please try again.'}); 
              }); 
           } catch (error) {
            res.status(201).json({message:'Falied to Sign up. Please try again.'}); 
           }
       }else if(existingUser == null){
            const user = new User({
                name:name,
                email:email,
                gender:gender,
                password:hashedPassword,
                date:Date.now()
            });
            user.save().then(async (response)=>{
                sender(user).then(response=>{
                    res.status(200).json({message:'Email sent to '+response.accepted[0]+ '. Please verify your Email ID.'});
                }).catch (error=>{
                      res.status(201).json({message:'Falied to Sign up. Please try again.'}); 
                }); 
            }).catch(err=>{
                res.status(500).json({message:'Something went wrong.! try again.'});
            }); 
       }else{
        res.status(201).json({message:'Something went wrong.! try again.'});
       }
   }catch(err){
       res.status(500).json({message:'Could not sign up. Try again.'});
   }
    
});

router.post('/login', async (req,res)=>{
    let findUser;
    let profile;
    let isValidPassword = false;
    try{
        findUser = await User.findOne({email:req.body.email});
        if(!findUser){
            res.status(201).json({message:'User ID and Password does not match.'});
        }else{
            try {
                isValidPassword = await bcrypt.compare(req.body.password,findUser.password);
                if(findUser.status=='Inactive'){
                    res.status(201).json({message:'Please activate your email.'}); 
                }else if(!isValidPassword){
                    res.status(201).json({message:'Email ID and Password does not match.'});   
                }
                else if(isValidPassword && findUser.status=='Active'){
                    let token;
                    profile = await Profile.findOne({'_id':findUser.id});
                    token = jwt.sign({userID:findUser.id},process.env.SECRET_KEY,{expiresIn:'24h'});
                    res.json({message:'Welcome to Proclick.',token:token,userID:findUser.id,avatar:profile.filename});                    
                }
            } catch (error) {
                res.status(500).json({message:'Could not login. Try again.'});
            }

        }
    }catch(err){
        res.status(500).json({message:'Could not login. Try again.'});
    }
});
router.get('/logout',async (req,res)=>{
    const token = req.headers.authorization;
});
router.post('/token', async (req,res)=>{
    let user;
    try{
         user = await jwt.verify(req.body.token,process.env.SECRET_KEY);
    }catch(err){
        res.status(201).json({message:'Your Token has Expaired. Please sign up again.'});
    }
    if(user){
        let findUser;
        try {
            findUser = await User.findByIdAndUpdate({'_id':user.userID},{$set:{status:'Active'}});
            if(findUser){
                res.json({message:'Your Email has been verified.'});
                const profile = new Profile({
                    _id:findUser._id,
                    name:findUser.name,
                    date: new Date(),
                });
                profile.save();
                const notify = new Notify({
                    _id:findUser._id,
                });
                notify.save();
               }else{
                res.status(201).json({message:'Email verification falied. Please try again.'});
               }
        } catch (error) {
            res.status(201).json({message:'Email verification falied. Please try again.'});
        }
    }
});

router.post('/forgot', async (req,res)=>{
    try {
        const user =await User.findOne({email:req.body.email});
        if(user){
            passwordReset(user).then(response=>{
                res.status(200).json({message:'Email sent to '+response.accepted[0]});
            }).catch (error=>{
                  res.status(201).json({message:'Falied to reset your password. Please try again.'}); 
            });
        }else{
            res.status(201).json({message:`${req.body.email} is not found.`});
        }
    } catch (error) {
        res.status(201).json({message:'Server Error'});
    }

});

router.post('/forgot/token', async (req,res)=>{
    try {
        const find = await jwt.verify(req.body.token,process.env.SECRET_KEY); 
        if(find){
            res.json({message:'Authorized to reset password.'});
        }else{
            res.status(201).json({message:'Your Token has Expaired. Please try again.'}); 
        }  
    } catch (error) {
      res.status(201).json({message:'Your Token has Expaired. Please try again.'});  
    }
});
router.post('/forgot/change', async (req,res)=>{
    try {
    const token = req.headers.authorization;
    const user = await jwt.verify(token,process.env.SECRET_KEY);
      const hashedPassword = await bcrypt.hash(req.body.password,12);  
      const post = {
          password:hashedPassword
      }
      User.findByIdAndUpdate({'_id':user.userID},{$set:post}).then(response=>{
        res.json({message:'Your password has been updated. Directing to Login page.'});
      });
    } catch (error) {
        res.status(201).json({message:'Your Token has Expaired. Please try again.'});    
    }
});
module.exports = router;