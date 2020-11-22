const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    filename : {
        type: String,
        require:true
    },
    path:{
        type: String,
        default:'http://localhost:5000/uploads/'
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
        default: new Date().getTime()
    }
});

module.exports = mongoose.model('uploads',uploadSchema);