const express = require('express');
const router = express.Router();
const Mentor = require('../Modals/mentor');
const authorization = require('../middleware/Authorization');
const profileInfo = require('../Modals/profileInfo');
const { response } = require('express');

router.post('/make',authorization, async (req,res)=>{
    try {
        const findMe =await Mentor.findOne({'_id':req.user._id});
        const findMyMentor =await Mentor.findOne({'_id':req.body.id});
        const mentorProfile = await profileInfo.findOne({'_id':req.body.id});
        if(findMyMentor){
            const postToMyMentor = {
                name:req.user.name,
                avatar:req.user.filename,
                uid:req.user._id,
                date:Date.now()
            }
            findMyMentor.mentoring.push(postToMyMentor);
            findMyMentor.save();
        }else{
            res.status(201).json({message:'Faild to find your mentor data.'});
        }
        if(findMe){
            const postToMe = {
                name:mentorProfile.name,
                avatar:mentorProfile.filename,
                uid:mentorProfile._id,
                date:Date.now()
            }
            findMe.mentors.push(postToMe);
            findMe.save().then(response=>{
                res.json(response);
            });
        }else{
            res.status(201).json({message:'Faild to find your data.'});
        }
    } catch (error) {
        res.status(201).json(error); 
    }
});

module.exports = router;
