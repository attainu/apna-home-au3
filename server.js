const express = require('express');
const connect= require('./connection/connection');
const auth =require('./middleware/auth');
const userRoute=require('./user/user-auth');
const items=require('./user/items');
const orders=require('./user/order');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/' + 'public'));


//@user signin route
//@public route
app.use("/user", userRoute);

//@get route for items
app.use("/api/v1", items);


//@Route for orders
app.use("/order/api/v1", orders);


app.listen(7000,()=> console.log("app is started"));
