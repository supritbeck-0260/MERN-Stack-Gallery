const express = require('express');
const Profile = require('../Modals/profileInfo');
const Upload = require('../Modals/upload');
const Image = require('../Modals/image');
const Notify = require('../Modals/notification');
const authorization = require('../middleware/Authorization');
const router = express.Router();

router.post('/rate',authorization, async (req,res)=>{
    const post = {
        uid: req.user._id,
        rate: req.body.rate,
        date: Date.now()
    }
    try {
        const image = await Image.findOne({'_id':req.body.id});
        if(image){
            const find= image.ratings.findIndex((rate)=> rate.uid == req.user._id);
            let previous;
            if(find != -1){
                previous = image.ratings[find];
                image.ratings[find] = post;
            }else image.ratings.push(post);  
            image.save().then(async response=>{
                    const length = image.ratings.length;
                    const avg = image.ratings.reduce((total,curr)=>total+curr.rate,0)/length; 
                    const avgRate={
                            rate:avg,
                            total:length
                        }
                    Upload.findOneAndUpdate({'_id':req.body.id},{$set:{avgRate:avgRate}}).then( async response=>{
                         res.json({rating:avgRate});
                         const postNotify = {
                            name:req.user.name,
                            uid:req.user._id,
                            avatar:req.user.filename,
                            iid:req.body.id,
                            rate:req.body.rate,
                            filename:response.filename,
                            checked:false,
                            type:'R',
                            date:Date.now()
                        };
                        const notify =await Notify.findOne({'_id':response.uid});
                        const indexNum = notify.notification.findIndex(value=>(value.iid==req.body.id && value.uid==req.user._id && value.rate));
                        if(indexNum != -1) notify.notification[indexNum] = postNotify;
                        else notify.notification.push(postNotify);
                        notify.save();
                        const profile = await Profile.findOne({'_id':response.uid});
                        if(profile.avgRate){
                            const total = (previous?profile.avgRate.total:profile.avgRate.total+1);
                            const rate = (profile.avgRate.rate*profile.avgRate.total+req.body.rate-(previous?previous.rate:0))/total;
                            profile.avgRate = {rate,total};
                        }else profile.avgRate  = {rate:req.body.rate,total:1};
                        profile.save();
                     });
                });
        }else{
        const image = new Image({
                _id:req.body.id,
                ratings:[post]
            });
        image.save().then(response=>{
                res.json({message:'rated-'+req.body.rate});
            }); 
        }
    } catch (error) {
      res.status(201).json({message:'Server Error.'});  
    }
});
router.post('/comment/post',authorization, async (req,res)=>{
    const post = {
        uid:req.user._id,
        user:{
            name:req.user.name,
            avatar:req.user.filename
        },
        comment:req.body.comment,
        date:Date.now()
    }
    const image = await Image.findOne({"_id":req.body.id});
    if(image){
       image.comments.push(post);
       image.save().then(async response=>{
        const sorted = response.comments.sort((a,b)=>b.date-a.date);
        res.json(sorted);
        const findUser = await Upload.findOne({'_id':req.body.id});
        const postNotify = {
            name:req.user.name,
            uid:req.user._id,
            avatar:req.user.filename,
            iid:req.body.id,
            filename:findUser.filename,
            checked:false,
            type:'C',
            date:Date.now()
        };
        const notify =await Notify.findOne({'_id':findUser.uid});
        notify.notification.push(postNotify);
        notify.save();
       });
    }

});

router.post('/comment/get', async (req,res)=>{
    try {
      const image = await Image.findOne({'_id':req.body.id});
      if(image){
         const sorted = image.comments.sort((a,b)=>b.date-a.date);
            res.json(sorted);
       }else{
            res.status(201).json({message:'No comments found'})
        } 
    } catch (error) {
        res.status(201).json({message:'Server Error'});
    }

});

module.exports = router;