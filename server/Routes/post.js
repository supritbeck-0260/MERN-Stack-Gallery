const express = require('express');
const Profile = require('../Modals/profileInfo');
const Upload = require('../Modals/upload');
const User = require('../Modals/user');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const webp=require('webp-converter');
const bcrypt = require('bcryptjs');

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

router.get('/get',async (req,res)=>{
    console.log('Get Request..');
    try{
        const posts = await Post.findById({"_id":"5f4b2d6d66faff47dce1cdf9"});
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
router.post('/postdata',async (req,res)=>{
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
        filename:req.file.filename,
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

router.post('/signup', async (req,res)=>{
    let hashedPassword;
    let existingUser;
    try{
       existingUser = await User.findOne({email:req.body.email});
       if(existingUser){
        res.status(201).json({message:'This Email ID has already been registered.!'});
       }else{
            try{
                 hashedPassword = await bcrypt.hash(req.body.password,12);
            }catch(err){
                res.status(500).json({message:'Could not create user. Try again.'});
            }
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                gender:req.body.gender,
                password:hashedPassword,
                date:Date.now()
            });
            user.save().then(response=>{
                res.send({message:'New user Created.'});
            }).catch(err=>{
                res.status(500).json({message:'Something went wrong.! try again.'});
            }); 
       }
   }catch(err){
       res.status(500).json({message:'Could not sign up. Try again.'});
   }
    
});

router.post('/login', async (req,res)=>{
    let findUser;
    let isValidPassword = false;
    try{
        findUser = await User.findOne({email:req.body.email});
        if(!findUser){
            res.status(201).json({message:'User ID and Password does not match.'});
        }else{
            try {
                isValidPassword = await bcrypt.compare(req.body.password,findUser.password);
                if(isValidPassword){
                    res.json({message:'Welcome.'});
                }else{
                    res.status(201).json({message:'User ID and Password does not match.'});
                }
            } catch (error) {
                res.status(500).json({message:'Could not login. Try again.'});
            }

        }
    }catch(err){
        res.status(500).json({message:'Could not login. Try again.'});
    }
});

module.exports = router;