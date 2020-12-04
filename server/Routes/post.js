const express = require('express');
const Profile = require('../Modals/profileInfo');
const Upload = require('../Modals/upload');
const router = express.Router();
const multer = require('multer');
const webp=require('webp-converter');
require('dotenv/config');

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

router.get('/profile/info/fetch',async (req,res)=>{
    console.log('Get Request..');
    try{
        const posts = await Profile.findById({"_id":"5f4b2d6d66faff47dce1cdf9"});
        res.json(posts);
    }catch(err){
        res.json({message:err});
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
        res.json({message:err});
    }
    
});

router.post('/profilepic',profileUpload,async (req,res)=>{
    const post={
        profile:req.file.filename,
    }
    compression('profile',req.file.filename).then(resp=>{
    Profile.findByIdAndUpdate({"_id":"5f4b2d6d66faff47dce1cdf9"},{$set:post})
    .then((response)=>{
        res.json(response);
    });
    });
});
router.post('/profile/info/update',async (req,res)=>{
    const post = {
        camera: req.body.camera,
        lenses: req.body.lenses,
        editing: req.body.editing,
        others: req.body.others,
        location: req.body.location,
    };
    Profile.findByIdAndUpdate({"_id":"5f4b2d6d66faff47dce1cdf9"},{$set:post})
.then((response)=>{
    res.json(response);
});
   
});

router.post('/upload',upload, async (req,res) =>{
    const info = JSON.parse(req.body.info);
    const upload = new Upload({
        path:process.env.UPLOAD_PATH+req.file.filename,
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