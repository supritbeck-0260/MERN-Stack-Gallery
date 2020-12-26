const express = require('express');
const router = express.Router();
const Mentor = require('../Modals/mentor');
const authorization = require('../middleware/Authorization');
const profileInfo = require('../Modals/profileInfo');
const Notify = require('../Modals/notification');
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
            if(check == -1 && (findMyMentor._id != req.user._id)){
                findMyMentor.mentoring.push(postToMyMentor);
                const length = findMyMentor.mentoring.length;
                findMyMentor.save().then(async response=>{
                    res.json({mentoring:length});
                    const postNotify = {
                        name:req.user.name,
                        uid:req.user._id,
                        avatar:req.user.filename,
                        checked:false,
                        type:'M',
                        date:Date.now()
                    };
                    const notify =await Notify.findOne({'_id':req.body.id});
                    const indexNum = notify.notification.findIndex(value=>(value.uid==req.user._id && value.type=='M'));
                    if(indexNum != -1){
                        notify.notification[indexNum] = postNotify;
                        notify.save();
                    }else{
                        notify.notification.push(postNotify);
                        notify.save();
                    }

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
            if(check == -1 && (findMyMentor._id != req.user._id)){
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
    try {
        const findMyMentor = await Mentor.findById({'_id':req.body.id});
        const findMe = await Mentor.findById({'_id':req.user._id});
        findMyMentor.mentoring = findMyMentor.mentoring.filter(value=>value.uid != req.user._id);
        

        const length = findMyMentor.mentoring.length;
        findMyMentor.save();
        findMe.mentors = findMe.mentors.filter(value=>value.uid != req.body.id);
        findMe.save();
        res.json({mentoring:length});
    } catch (error) {
       res.status(201).json(error); 
    }
});
router.post('/list', async (req,res)=>{
    try {
        const find = await Mentor.findById({'_id':req.body.id});
        if(find){
            res.json(find[req.body.type]);
        }else{
            res.status(201).json({message:'No data found'});
        }
    } catch (error) {
       res.status(201).json({message:'Server Error'}); 
    }
});
module.exports = router;
