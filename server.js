const express = require('express');
const connect= require('./connection/connection');
const auth =require('./middleware/auth');
const userRoute=require('./user/user-auth');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/' + 'public'));


//@user signin route
//@public route
app.use("/user", userRoute);

//@user signup route



app.listen(8080,()=> console.log("app is started"));
