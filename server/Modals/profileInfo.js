const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    filename:{
        type:String,
    },
    camera:{
        type: Array,
    },
    lenses:{
        type: Array,
    },
    editing:{
        type: Array,
    },
    others:{
        type: Array,
    },
    date: {
        type: Number,
    }
});

module.exports  = mongoose.model('ProfileInfo',PostSchema)