const express=require('express');
const auth =require('../middleware/auth');
const {check,validationResult}=require('express-validator');
const cloudinary =require('../common/cloudinary');
const router=express.Router();
const orderQuery= require('../queries/orderQueries');



router.post("/order",[
 auth,
  check('itemId').isNumeric().withMessage('Only Numeric value is allowed')
        .exists().withMessage('itemId is required'),
 check('itemQuantity').isNumeric().withMessage('Only Numeric value is allowed')
        .exists().withMessage('itemQuantity is required'),
 check('streetNo','Address is required').exists(),
 check('state','state is required').exists(),
 check('phoneNo','phone no is required').exists(),
 check('zipcode','zip code is required').exists(),
 check('country', 'country is required').exists()
],async (req,res)=>{

     const error = validationResult(req);

     if (!error.isEmpty()) {
       return res.status(400).json({
         error: error.array()
       });
     }

     const {
       itemQuantity,
       itemId
     } = req.body;

      const checkItemsQuantity =await orderQuery.checkItemQuantity(req) 
      console.log("checkItemsQuantity", checkItemsQuantity.rows);
      if (!checkItemsQuantity || !checkItemsQuantity.rows.length) {
          res.status(400).json({
              "success":false,
              "msg":"Less no of items are present at this time"
          })
          return;
      }
     const { itemcoverimage, itemimages } = checkItemsQuantity.rows[0];
    try{

      const result = await orderQuery.createOrder(req, checkItemsQuantity);
      if(!result){
           res.status(500).json({
             error: "Server error occoured",
             success:false
           });
           return
       }

        res.status(201).json({
          success: true,
          msg: "Order Successfully placed"
        });
    
    const coverUrl = await cloudinary.uploader.upload(itemcoverimage);
    const itemUrls= itemimages.map(async url=>{
        const temp=await cloudinary.uploader.upload(url);
        return temp.secure_url;
    })
    
   await orderQuery.updateOrderImageUrls(itemUrls, coverUrl, result);

     let updatedItemQuantity =
       checkItemsQuantity.rows[0].itemquantity - itemQuantity;
      
       await orderQuery.updateOrderItemQuantity(updatedItemQuantity, itemId);

    }
    catch(error){
        console.log(error,">>>>>>>");
        res.status(500).json({
            "error":error
        })
        return
    }

})


//@TODO delivery date orderdate updated at
router.put(
  "/order/:id",
  [
    auth,
    check("itemQuantity")
      .isNumeric()
      .withMessage("Only Numeric value is allowed")
      .exists()
      .withMessage("itemQuantity is required"),
    check("streetNo", "Address is required").exists(),
    check("state", "state is required").exists(),
    check("phoneNo", "phone no is required").exists(),
    check("zipcode", "zip code is required").exists(),
    check("country", "country is required").exists()
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array()
      });
    }
    const { itemQuantity, itemId } = req.body;
   
    try {

      //update order  
        const prevOrderDetails = await orderQuery.getOrderDetailsById(req);
        req.body.itemQuantity -= prevOrderDetails[0].itemquantity;
        console.log("quantity", req.body.itemQuantity,prevOrderDetails[0].itemquantity);
        let checkItemsQuantity;
           checkItemsQuantity = await orderQuery.checkItemQuantity(req);
        console.log("checkItemsQuantity", checkItemsQuantity.rows);
        if (!checkItemsQuantity || !checkItemsQuantity.rows.length) {
          res.status(400).json({
            success: false,
            msg: "Less no of items are present at this time"
          });
          return;
        }

     
          console.log(prevOrderDetails);
      const result = await orderQuery.updateOrder(
        req,
        prevOrderDetails[0].itemquantity,
        checkItemsQuantity.rows[0].itemprize,
        checkItemsQuantity.rows[0].discount
      );
      if (!result) {
        console.log(error);  
        res.status(500).json({
          error: "Server error occoured",
          success: false
        });
        return;
      }

      res.status(201).json({
        success: true,
        msg: "Order Successfully updated"
      });

      //add previous quantity and substract current quantity
      let updatedItemQuantity =
        checkItemsQuantity.rows[0].itemquantity - req.body.itemQuantity;

      await orderQuery.updateOrderItemQuantity(updatedItemQuantity, itemId);
    } catch (error) {
      console.log(error, ">>>>>>>");
      res.status(500).json({
        error: error
      });
      return;
    }
  }
);

module.exports=router;