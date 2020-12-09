const express = require('express');
const Profile = require('../Modals/profileInfo');
const Upload = require('../Modals/upload');
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
        res.json(posts);
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

router.post('/get/one',async (req,res)=>{
    const id=req.body.id;
    try{
        const posts = await Upload.findOne({_id:id});
        res.json(posts);
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
            res.json({message:"Picture Deleted"});
        }).catch(err=>{
            res.json({message:err});
        });
    }else{
        res.status('201').json('Forbidden Access.');
    }
});



module.exports = router;