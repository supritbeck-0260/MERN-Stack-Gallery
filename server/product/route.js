const express = require('express');
const router = express.Router();
const Products = require('./schema');
const authorization = require('../middleware/Authorization');
router.post('/save',authorization, async (req,res)=>{
    try {
        const {item,name,link} = req.body
        const product =await Products.find();
        if(product[0][item]){
            const find =  product[0][item].findIndex(value=>value.name==name);
            if(find == -1){
                product[0][item].push({name,link}); 
            }else{
                product[0][item][find]= {name,link};
            }
            product[0].save().then(response=>{
                res.json({message:'Saved to Database.'});
            });
        }else{
            res.status(201).json({message:'Item is missing in database'});
        }
    } catch (error) {
        res.status(201).json({message:'Failed to save Data.'}); 
    }
});


module.exports = router;
