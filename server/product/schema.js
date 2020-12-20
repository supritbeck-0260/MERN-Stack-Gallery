const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    camera:[
        {name:String,link:String}
    ],
    lenses:[
        {name:String,link:String}
    ],
    editing:[
        {name:String,link:String}
    ],
    others:[
        {name:String,link:String}
    ]
});

module.exports = mongoose.model('products',productSchema);