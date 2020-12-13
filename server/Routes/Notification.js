const express = require('express');
const Notify = require('../Modals/notification');
const router = express.Router();
const authorization = require('../middleware/Authorization');
const { response } = require('express');
router.get('/',authorization, async (req,res)=>{
    try {
        const find = await Notify.findOne({'_id':req.user._id});
        if(find){
            const sorted = find.notification.sort((a,b)=>b.date-a.date);
            const newData = find.notification.filter((value)=>value.checked==false);
            res.json({notify:sorted,new:newData.length});  
        }else{
            res.status(201).json({message:'No comment found.'});
        }
  
    } catch (error) {
        res.status(201).json({message:'Server Error'});
    }
});

router.get('/checked',authorization,async (req,res)=>{
    try {
        const find = await Notify.findOne({'_id':req.user._id});
        find.notification.map((value)=>value.checked=true);
        find.save().then(response=>{
            res.json({message:'checked.'});
        });
    } catch (error) {
        res.status(201).json({message:'Server Error'});
    }
});

module.exports = router;