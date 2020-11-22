const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
app.use(cors());
const postsRoute = require('./Routes/post');

app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true , useUnifiedTopology: true },
    (err)=>{
    if(err) throw err;
    console.log("DB Connected..");
});
mongoose.set('useFindAndModify', false);

app.use('/',postsRoute);

app.listen(5000,()=>{console.log("server started at 5000");});