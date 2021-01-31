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

router.get('/show',async (req,res)=>{
  try {
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
  } catch (error) {
    res.json('Server Error');
  }
});
module.exports = router;