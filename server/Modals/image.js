const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    ratings:[
        {uid:String,rate:Number,date:String}
    ],
    comments:[
        {uid:String,comment:String,date:String,}
    ]
});

module.exports = mongoose.model('RatesComments',userSchema);