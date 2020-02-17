const express=require('express');
const router=express.Router();
const query=require('../queries/userQueries');
const conn=require("../connection/connection");

//@Route for getting items by pagination
//request query contains pageNo=1&itemsPerPage=5
router.get("/items?",async (req,res)=>{

  console.log(req.query);
  const result =await query.getItems(req,conn);
  console.log(result);
  if(!result){
      res.status(500).json({"error":[{
          "msg":"Server Error Try Again Later"
      }]})
  }

  //5 totalpages 
  const items={
      count:10,
      currPage:req.query.pageNo,
      totalPage:5,
      nextUrl: req.query.pageNo <5 ?"url":null,
      prevUrl: req.query.pageNo >1?"prevUrl":null,
      data:result.rows
  }  

  res.status(200).json(items);

});



module.exports= router;