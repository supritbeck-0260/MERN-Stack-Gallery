const express = require('express');
const router = express.Router();
const Products = require('./schema');
const User = require('../Modals/user');
const authorization = require('../middleware/Authorization');
router.post('/save',authorization, async (req,res)=>{
    try {
        const admin = await User.findById({'_id':req.user._id});
        if(admin.email == 'supritbeck@gmail.com'){
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
        }else{
            res.status(201).json({message:'You are not authorized'});
        }
    } catch (error) {
        res.status(201).json({message:'Failed to save Data.'}); 
    }
});

router.post('/fetch',authorization, async (req,res)=>{
    const product = await Products.find();
    if(product){
    const {item,name} = req.body;
    const regex = new RegExp(name, 'i');
    const find = product[0][item].filter(value=>regex.test(value.name));
    res.json(find);
    }else{
        res.status(201).json({message:'No product fount'});
    }

});

module.exports = router;
