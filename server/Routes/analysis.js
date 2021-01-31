const express = require('express');
const router = express.Router();
const Analysis = require('../Modals/analysis');
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

router.post('/get',async (req,res)=>{
  try {
    const analysis = await Analysis.find();
    res.json(analysis);    
  } catch (error) {
    req.json('Server Error');
  }
});
module.exports = router;