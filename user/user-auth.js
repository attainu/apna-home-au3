const express = require("express");
const jwt = require("jsonwebtoken");
const {check,validationResult} =require("express-validator");
const bcrypt=require('bcryptjs');
const client=require('../connection/connection');
const userQueries = require('../queries/userQueries');
const config=require('config');
const app = express();
const router = express.Router();
const auth =require('../middleware/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/" + "public"));


//@public login route
router.post("/signin",async (req, res) => {
  
  try{

    const user= await userQueries.signIn(req,client);
   console.log(user);
     
    if(user && user.rows.length>0){
      delete user.rows[0].password;
      const payload = JSON.stringify({
        id: user.rows[0].id,
        email:user.rows[0].email
      })
      console.log(payload);
      
      jwt.sign({
        id: user.rows[0].id,
        email: user.rows[0].email,
        iat: Math.floor(Date.now() / 1000) 
      }, config.get('jwtSecret'), { expiresIn:'8h' },(error,token)=>{

        console.log("Hello");
        if(error){
         res.status(403).json({"msg":error});
        // console.log(error)
         return;
        }
         
         res.status(200).json({token});
      }
        
      )
     
    }
    else{
      res.status(400).json({
        "msg":"Enter valid credential"
      })
    }
  }catch(error){

    console.log(error,">>>>")
  }

});


//@public signup route
router.post(
  "/signup",
  [
    check("firstname", "First Name Is Required").exists(),
    check("phoneno", "Phone number Is Required").exists(),
    check("email", "Enter valid Email").isEmail(),
    check("password", "Password is required").exists()
  ],
 async (req, res) => {

      const error = validationResult(req);

      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      let {firstname,lastname,phoneno,email,password}=req.body;
       const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
       console.log("password",password);


      try{
         const result = await client.query(`INSERT INTO userdetails(firstname,lastname,phoneno,email,password) VALUES($1,$2,$3,$4,$5)`,[firstname,lastname,phoneno,email,password]);
         console.log(result,"????");
         res.json(result);
      }
      catch(error){
        console.log(error,">>>>>");
        res.json({
          error:error
        })
      }

  }
);


router.get('/api',auth,(req,res)=>{

  res.json({
    body:req.body
  })
})



module.exports=router;

