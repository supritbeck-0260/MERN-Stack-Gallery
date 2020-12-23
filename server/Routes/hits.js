const express = require('express');
const router = express.Router();
const Upload = require('../Modals/upload');

router.get('/', async (req,res)=>{
    try {
    const gather =await Upload.find();
        if(gather){
            const sorted = gather.sort((a,b)=>{
                if(b.avgRate || a.avgRate){
                    if(b.avgRate && a.avgRate){
                      return (b.avgRate.rate-a.avgRate.rate);
                     }else if(b.avgRate == undefined && a.avgRate){
                        return -1;
                    }else if(b.avgRate && a.avgRate == undefined){
                        return 1;
                    }else{
                        return 0;
                    }
                }else{
                    return 0;
                }
            });
            const limited = sorted.slice(0,10);
            res.json(limited);
        }else{
            res.json({message:'No Hits Found'});
        }
    } catch (error) {
       res.status(201).json({message:'Server Error'}); 
    }

});

module.exports = router;