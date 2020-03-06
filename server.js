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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//@user signin route
app.get("/",(req,res)=>{
    console.log("helloooo");
    res.json("Hello");
})
//@public route

app.use("/user", userRoute);

//@get route for items
app.use("/api/v1", items);


//@Route for orders
app.use("/order/api/v1", orders);


app.listen(8080,()=> console.log("app is started"));
