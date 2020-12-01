const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    profile:{
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
        default: new Date().getTime()
    }
});

module.exports  = mongoose.model('ProfileInfo',PostSchema)