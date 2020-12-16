const express = require('express');
const router = express.Router();
const Upload = require('../Modals/upload');

router.get('/', async (req,res)=>{
    try {
    const gather =await Upload.find();
    const sorted = gather.sort((a,b)=>b.rate-a.rate);
    const limited = sorted.slice(0,10);
    res.json(limited);
    } catch (error) {
       res.status(201).json({message:'Server Error'}); 
    }

});

module.exports = router;