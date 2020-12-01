const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:'Inactive'
    },
    date:{
        type:String,
    }
});

module.exports = mongoose.model('users',userSchema);