const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Notification = require('./Routes/Notification');
const socket = require('./Socket/socket');
require('dotenv/config');
app.use(cors());

const postsRoute = require('./Routes/post');
const LoginSignUp =  require('./Routes/LoginSignUp');
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
app.use('/auth',LoginSignUp);
app.use('/notification',Notification);

const server = app.listen(process.env.PORT || 5000,()=>{console.log("server started...");});
socket(server);