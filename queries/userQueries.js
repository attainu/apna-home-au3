const bcrypt=require('bcryptjs');


const signIn=async(req,db)=>{

    let {email,password}=req.body;
    const salt = await bcrypt.genSalt(10);
    
    console.log(password);
    const query={
       text: 'Select * from userdetails where email=$1',
       values:[email]
    }

    try{
    const result =await db.query(query)
        //console.log(result);
        if (await bcrypt.compare(password,result.rows[0].password))
              return result;

    } catch(error){
        console.log(error);
    }
}


const getItems=async(req,db)=>{


    req.query.itemsPerPage = req.query.itemsPerPage ? req.query.itemsPerPage : 10;
    req.query.pageNo       = req.query.pageNo ? req.query.pageNo : 1;

    const offset = Number(req.query.pageNo -1) * Number(req.query.itemsPerPage);
    const count = Number(req.query.itemsPerPage);

    const query = {
        text: 'Select * from itemdetails limit $1 offset $2',
        values: [count,offset]
    } 
    
    try{

     const result=await  db.query(query);
      return result;

    } catch(error){
          
        console.log(error);
    }

}

module.exports={
    signIn,
    getItems
}