const express = require('express');
const router = express.Router();
const Upload = require('../Modals/upload');
const Profile = require('../Modals/profileInfo');

router.post('/', async (req,res)=>{
    const {category,search} = req.body;
    const regex = new RegExp(search, 'i');
    if(category == 'photographer'){
    const find = await Profile.find();
        if(find.length){
            const filtered = find.filter(value=> regex.test(value.name));
            if(filtered.length) res.json({filtered,category,search});
            else res.status(201).json({message:'No result found',category,search});
        }else{
            res.status(201).json({message:'No result found',category,search});
        }
    }else{
        const find = await Upload.find();
        if(find.length){
            if(req.body.param =='all') return res.json({filtered:find.slice(0,10),category,search:'all'});
            const filtered = find.filter(value=>{
                if(value[category]) return regex.test(value[category].value);
                else return false;
            });
            if(filtered.length) res.json({filtered,category,search});
            else res.status(201).json({message:'No result found',category,search});
            
        }else{
            res.status(201).json({message:'No result found',category,search});
        }
  }

});

module.exports = router;