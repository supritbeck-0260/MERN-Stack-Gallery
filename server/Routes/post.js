const express = require('express');
const Post = require('../Modals/post');
const Upload = require('../Modals/upload');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const Storage = multer.diskStorage({
    destination:"./public/uploads",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
});

const upload = multer({
    storage:Storage
}).single('file');

const StorageProfile = multer.diskStorage({
    destination:"./public/profile",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
});

const profileUpload = multer({
    storage:StorageProfile
}).single('profile');
router.get('/get',async (req,res)=>{
    console.log('Get Request..');
    try{
        const posts = await Post.findById({"_id":"5f4b2d6d66faff47dce1cdf9"});
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
    
});

router.get('/getpics',async (req,res)=>{
    try{
        const posts = await Upload.find().sort({'date':-1});
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
        res.json({message:err});
    }
    
});

router.post('/profilepic',profileUpload,async (req,res)=>{
    const post={
        profile:req.file.filename,
    }
    Post.findByIdAndUpdate({"_id":"5f4b2d6d66faff47dce1cdf9"},{$set:post})
    .then((response)=>{
        res.json(response);
    });
});
router.post('/postdata',async (req,res)=>{
    const post = {
        camera: req.body.camera,
        lenses: req.body.lenses,
        editing: req.body.editing,
        others: req.body.others,
        location: req.body.location,
    };
    Post.findByIdAndUpdate({"_id":"5f4b2d6d66faff47dce1cdf9"},{$set:post})
.then((response)=>{
    res.json(response);
});
   
});

router.post('/upload',upload, async (req,res) =>{
    const info = JSON.parse(req.body.info);
    const upload = new Upload({
        filename:req.file.filename,
        about: info.about,
        camera: info.camera,
        lenses: info.lenses,
        editing: info.editing,
        others: info.others,
        location: info.location,
    });
    upload.save().then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json({message:err});
    });
});

router.post('/upload/edit', async (req,res) =>{
    const edit = {
        about: req.body.about,
        camera: req.body.camera,
        lenses: req.body.lenses,
        editing: req.body.editing,
        others: req.body.others,
        location: req.body.location,
    };
    Upload.findByIdAndUpdate({"_id":req.body.id},{$set:edit}).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json({message:err});
    });
});

router.post('/upload/delete', async (req,res)=>{
    Upload.findByIdAndDelete({"_id":req.body.id}).then(response=>{
        res.json("Picture Deleted");
    }).catch(err=>{
        res.json({message:err});
    });
});


module.exports = router;