const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    ratings:[
        {uid:String,rate:Number,date:Number}
    ],
    comments:[
        {uid:String,user:Object,comment:String,date:Number}
    ]
});

module.exports = mongoose.model('RatesComments',userSchema);