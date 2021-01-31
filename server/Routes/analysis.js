const express = require('express');
const router = express.Router();
const User = require('../Modals/user');
const Analysis = require('../Modals/analysis');
const authorization = require('../middleware/Authorization');
router.post('/save', async (req,res)=>{
    try {
    const analysis = new Analysis({
            uid:req.body.uid,
            owner:req.body.owner,
            product:req.body.product,
            type:req.body.type,
            date:new Date()
        });
    analysis.save().then(()=>res.json('saved.'));
    } catch (error) {
      req.json('Server Error');  
    }
});

router.get('/show',authorization,async (req,res)=>{
  try {
    const admin = await User.findById({'_id':req.user._id});
    if(admin.email == 'supritbeck@gmail.com'){
    const analysis = await Analysis.find();
    let formated = {};
    analysis.forEach(value=>{
      const date = new Date(value.date).toLocaleDateString()
      if(formated[date]) formated[date].push(value);
      else {
        formated[date] = [];
        formated[date].push(value);
      }
    });
    res.json(formated); 
  }else  res.status(201).json({message:'Unauthorize Access'}); 
  } catch (error) {
    res.status(201).json({message:'Server Error'});
  }
});
module.exports = router;