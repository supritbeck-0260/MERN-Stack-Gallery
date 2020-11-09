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
        type: Date,
        default: Date.now()
    }
});

module.exports  = mongoose.model('ProfileInfo',PostSchema)