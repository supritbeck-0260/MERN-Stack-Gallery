const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    uid:{
        type:String,
        require:true
    },
    filename : {
        type: String,
    },
    path:{
        type: String,
    },
    about:{
        type: String,
    },
    camera:{
        type: String,
    },
    lenses:{
        type: String,
    },
    editing:{
        type: String,
    },
    others:{
        type: String,
    },
    location:{
        type: String,
    },
    date:{
        type: Number,
    }
});

module.exports = mongoose.model('newuploads',uploadSchema);