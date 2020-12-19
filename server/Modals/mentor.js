const mongoose = require('mongoose');

const mentorSchema = mongoose.Schema({
    mentoring:[
    {name:{
        type:String,
        require:true
    },
    avatar:{
        type:String
    },
    uid:{
        type:String,
        require:true  
    },
    avatar:{
        type:String, 
    },
    date:{
        type:Number,
    }}],
    mentors:[
        {name:{
            type:String,
            require:true
        },
        avatar:{
            type:String
        },
        uid:{
            type:String,
            require:true  
        },
        avatar:{
            type:String, 
        },
        date:{
            type:Number,
        }}]
});

module.exports = mongoose.model('mentor',mentorSchema);