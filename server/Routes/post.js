const express = require('express');
const Profile = require('../Modals/profileInfo');
const Upload = require('../Modals/upload');
const Image = require('../Modals/image');
const Notify = require('../Modals/notification');
const Mentor = require('../Modals/mentor');
const router = express.Router();
const multer = require('multer');
const webp=require('webp-converter');
require('dotenv/config');
const authorization = require('../middleware/Authorization');
const compression = (type,name) =>{
    return webp.cwebp(`./public/${type}Org/${name}`,`./public/${type+(type=='upload'?'s':'')}/${name}`,"-q 80");
}
const Storage = multer.diskStorage({
    destination:"./public/uploadOrg",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+'.webp')
    }
});

const upload = multer({
    storage:Storage
}).single('file');

const StorageProfile = multer.diskStorage({
    destination:"./public/profileOrg",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+'.webp')
    }
});

const profileUpload = multer({
    storage:StorageProfile
}).single('profile');

router.post('/profile/info/fetch',async (req,res)=>{
    try{
        const posts = await Profile.findById({"_id":req.body.id});
        const {name,about,filename,camera,lenses,editing,others,date,_id} = posts;
        if(req.body.id == req.body.myuid){
            const findMy = await Mentor.findById({"_id":req.body.myuid});
            const mentors =  findMy.mentors.length;
            const mentoring = findMy.mentoring.length;
            res.json({_id,name,about,filename,camera,lenses,editing,others,date,mentoring,mentors});
        }else{
            const findUser =await Mentor.findById({"_id":req.body.id});
            const mentoring = findUser.mentoring.length;
            let isMentor = false;
            if(req.body.myuid && mentoring){
            isMentor =  (findUser.mentoring.find((value)=>value.uid == req.body.myuid) != undefined);
            }
            res.json({_id,name,about,filename,camera,lenses,editing,others,date,mentoring,isMentor});
        }
    }catch(err){
        res.status(201).json({message:'User Not Found.'});
    }
    
});
router.post('/profile/picture/update',[authorization,profileUpload],async (req,res)=>{
    const post={
        filename:req.file.filename,
    }
        compression('profile',req.file.filename).then(resp=>{
            Profile.findByIdAndUpdate({"_id":req.user._id},{$set:post})
            .then((response)=>{
                res.json({filename:req.file.filename});
            });
            });
            const update = {
                avatar:req.file.filename
            }
            Upload.updateMany({uid:req.user._id},update,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('Upload Updated');
                }
            });
});
router.post('/profile/images', async (req,res)=>{
    try {
        const upload  = await Upload.find({uid:req.body.id}).sort({'date':-1});
        if(upload.length){
            res.json(upload);
        }else{
            res.status('201').json({message:'No recored found'});
        }
    } catch (error) {
        res.status('201').json('Server Error.');
    }
    
    
});
router.post('/getpics',async (req,res)=>{
    const offset = req.body.offset;
    try{
        const posts = await Upload.find().skip(offset).limit(9).sort({'date':-1});
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
    
});

router.post('/image/rate',authorization, async (req,res)=>{
    const post = {
        uid: req.user._id,
        rate: req.body.rate,
        date: Date.now()
    }
    try {
        const image = await Image.findOne({'_id':req.body.id});
        if(image){
            const find= image.ratings.findIndex((rate)=> rate.uid == req.user._id);
            if(find != -1){
                image.ratings[find] = post;
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
                        if(indexNum != -1){
                            notify.notification[indexNum] = postNotify;
                            notify.save();
                        }else{
                            notify.notification.push(postNotify);
                            notify.save();
                        }
                     });
                });
            }else{
                image.ratings.push(post);
                image.save().then(response=>{
                    const length = image.ratings.length;
                    const avg = image.ratings.reduce((total,curr)=>total+curr.rate,0)/length; 
                    const avgRate={
                            rate:avg,
                            total:length
                        }
                     Upload.findOneAndUpdate({'_id':req.body.id},{$set:{avgRate:avgRate}}).then(async response=>{
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
                        if(indexNum != -1){
                            notify.notification[indexNum] = postNotify;
                            notify.save();
                        }else{
                            notify.notification.push(postNotify);
                            notify.save();
                        }
                     });
                });
            }
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
router.post('/image/comment/post',authorization, async (req,res)=>{
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

router.post('/image/comment/get', async (req,res)=>{
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
router.post('/get/one',async (req,res)=>{
    const id=req.body.id;
    try{
        const posts = await Upload.findOne({_id:id});
        if(posts){
        if(req.body.uid){
            const image = await Image.findOne({_id:id});
            if(image && image.ratings.length){
                const rate = image.ratings.find((rate)=>rate.uid==req.body.uid);
                res.json({info:posts,rate:rate?rate.rate:null});
            }else{
                res.json({info:posts});
            }

        }else{
            res.json({info:posts});
        }
    }else{
        res.status(201).json({message:'Image not Found'});
    }

    }catch(err){
        res.status(201).json({message:'Image Not Found'});
    }
    
});


router.post('/profile/info/update',authorization,async (req,res)=>{
        const post = {
            camera: req.body.camera,
            lenses: req.body.lenses,
            editing: req.body.editing,
            others: req.body.others,
            about:req.body.about,
        };
        if((req.body.id).toString() === (req.user._id).toString()){
            Profile.findByIdAndUpdate({"_id":req.user._id},{$set:post})
            .then((response)=>{
                res.json(response);
            });
        }else{
            res.status(201).json({message:'Forbidden Access.'});
        }
 
});

router.post('/upload',[authorization,upload], async (req,res) =>{
    const info = JSON.parse(req.body.info);
    let upload;
    try {
            upload = new Upload({
            uid:req.user._id,
            owner:req.user.name,
            filename:req.file.filename,
            avatar:req.user.filename,
            about: info.about,
            camera: info.camera,
            lenses: info.lenses,
            editing: info.editing,
            others: info.others,
            location: info.location,
            date: Date.now()
        });
        compression('upload',req.file.filename).then(resp=>{
            upload.save().then(response=>{
                res.json(response);
                const image = new Image({
                    _id:upload._id
                });
                image.save();
            }).catch(err=>{
                res.json({message:err});
            });
        });
    } catch (error) {
        res.status(201).json({message:'Server Error.'});
    }
});

router.post('/upload/edit',authorization, async (req,res) =>{
    const edit = {
        about: req.body.about,
        camera: req.body.camera,
        lenses: req.body.lenses,
        editing: req.body.editing,
        others: req.body.others,
        location: req.body.location,
    };
    if((req.body.uid).toString() === (req.user._id).toString()){
        Upload.findByIdAndUpdate({"_id":req.body.id},{$set:edit}).then(response=>{
            res.json(response);
        }).catch(err=>{
            res.json({message:err});
        });
    }else{
        res.status('201').json('Forbidden Access.');
    }
    
});

router.post('/upload/delete',authorization, async (req,res)=>{
    if((req.body.uid).toString() === (req.user._id).toString()){
        Upload.findByIdAndDelete({"_id":req.body.id}).then(response=>{
            Image.findByIdAndDelete({"_id":req.body.id}).then(response=>{
                res.json({message:"Picture Deleted"}); 
            });
        }).catch(err=>{
            res.json({message:'Failed'});
        });
    }else{
        res.status('201').json('Forbidden Access.');
    }
});



module.exports = router;