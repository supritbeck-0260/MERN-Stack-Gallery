const mongoose = require('mongoose');

const notifySchema = mongoose.Schema({
    notification:[
    {name:{
        type:String,
        require:true
    },
    checked:{
        type:Boolean,
        
    },
    filename:{
        type:String
    },
    uid:{
        type:String,
        require:true  
    },
    avatar:{
        type:String, 
    },
    iid:{
        type:String,
        require:true  
    },
    rate:{
        type:Number, 
    },
    date:{
        type:Number,
    }}]
});

module.exports = mongoose.model('notifications',notifySchema);