const mongoose = require('mongoose');

const analysisSchema = mongoose.Schema({
    uid:{
        type:String,
        require:true
    },
    name:String,
    product:{
        type:String,
        require:true
    },
    date:String
});

module.exports = mongoose.model('analysis',analysisSchema);