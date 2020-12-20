const express = require('express');
const router = express.Router();
const Mentor = require('../Modals/mentor');
const authorization = require('../middleware/Authorization');
const profileInfo = require('../Modals/profileInfo');

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
            const check = findMyMentor.mentoring.findIndex(value=>value.uid ==req.user._id);
            if(check == -1){
                findMyMentor.mentoring.push(postToMyMentor);
                const length = findMyMentor.mentoring.length;
                findMyMentor.save().then(response=>{
                    res.json({mentoring:length});
                });
            }else{
                const length = findMyMentor.mentoring.length;
                res.json({mentoring:length});
            }
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
            const check = findMe.mentors.findIndex(value=>value.uid ==req.user._id);
            if(check == -1){
                findMe.mentors.push(postToMe);
                findMe.save(); 
            }
        }else{
            res.status(201).json({message:'Faild to find your data.'});
        }
    } catch (error) {
        res.status(201).json(error); 
    }
});

router.post('/remove',authorization, async (req,res)=>{
    // try {
        const findMyMentor = await Mentor.findById({'_id':req.body.id});
        const findMe = await Mentor.findById({'_id':req.user._id});
        findMyMentor.mentoring = findMyMentor.mentoring.filter(value=>value.uid != req.user._id);
        

        const length = findMyMentor.mentoring.length;
        findMyMentor.save();
        findMe.mentors = findMe.mentors.filter(value=>value.uid != req.body.id);
        findMe.save();
        res.json({mentoring:length});
    // } catch (error) {
    //    res.status(201).json(error); 
    // }
});

module.exports = router;
