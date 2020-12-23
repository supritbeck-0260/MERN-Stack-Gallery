const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    uid:{
        type:String,
        require:true
    },
    avatar:{
        type:String,
    },
    owner:{
        type:String
    },
    filename : {
        type: String,
        require:true
    },
    about:{
        type: Object,
    },
    avgRate:{
        type: Object
    },
    camera:{
        type: Object,
    },
    lenses:{
        type: Object,
    },
    editing:{
        type: Object,
    },
    others:{
        type: Object,
    },
    location:{
        type: Object,
    },
    date:{
        type: Number,
    }
});

module.exports = mongoose.model('uploads',uploadSchema);