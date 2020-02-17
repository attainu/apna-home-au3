const connection = require("../connection/connection");

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};


const checkItemQuantity=async(req)=>{

     const {
       itemQuantity,
       itemId
     } = req.body;
     const checkQuery = {
       text: `
            select * from itemDetails where itemId=$1 And itemQuantity>=$2
            `,
       values: [itemId, itemQuantity]
     };
     try{
     const checkItemsQuantity = await connection.query(checkQuery); 
       return checkItemsQuantity;
     } catch(error){
          throw error;
         console.log(error);
     }

}


const createOrder = async (req, checkItemsQuantity) => {
  const {
    itemQuantity,
    phoneNo,
    streetNo,
    state,
    zipcode,
    country,
    status,
    itemId
  } = req.body;

  let {
    itemname,
    itemprize,
    vendorid,
    exptdayofdelivery,
    returnpolicy,
    discount,
    description,
    itemimages,
    detailsandfeatures,
    itemcoverimage,
    categoryname,
    weight,
    brand
  } = checkItemsQuantity.rows[0];

  itemprize = itemQuantity*(itemprize * (100 - discount)) / 100;
  console.log("discount", itemprize);

  const dateOfDelivery = new Date();
  const deliveryDate = dateOfDelivery.addDays(Number(exptdayofdelivery));

  const orderDate = new Date();
  const userId = req.user.id;

  const query = {
    text: `
        INSERT INTO ORDERDETAILS( itemname, prize, itemQuantity, phoneNo,  streetNo, state, zipcode,
        country, vendorid,expectedDelivery,returnpolicy,discount, description, itemimages, detailsandfeatures,
        itemcoverimage,categoryname,weight,brand,deliveryDate,userId,itemId,status,orderDate) 
        values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING orderId;`,
    values: [
      itemname,
      itemprize,
      itemQuantity,
      phoneNo,
      streetNo,
      state,
      zipcode,
      country,
      vendorid,
      exptdayofdelivery,
      returnpolicy,
      discount,
      description,
      itemimages,
      detailsandfeatures,
      itemcoverimage,
      categoryname,
      weight,
      brand,
      deliveryDate,
      userId,
      itemId,
      status,
      orderDate
    ]
  };

  try {
    const result = await connection.query(query);
    return result;
  } catch (error) {
     throw error;
  }
};


const updateOrderImageUrls =async (itemUrls, coverUrl, result) => {
  const updateQuery = {
    text: `
        update orderdetails set itemimages=$1 , itemcoverimage=$2 where orderId=$3
        `,
    values: [itemUrls, coverUrl, result.rows[0].orderId]
  };

    await connection.query(updateQuery);


};


const updateOrderItemQuantity=async (updatedItemQuantity,itemId)=>{
      const updateItemDetails = {
      text: `
        update itemDetails set itemQuantity=$1  where itemId=$2
        `,
      values: [updatedItemQuantity,itemId]
    };
     await connection.query(updateItemDetails);
}


const updateOrder =async (req,prevQuantity,itemprize,discount)=>{

     const {
       itemQuantity,
       phoneNo,
       streetNo,
       state,
       zipcode,
       country,
       status
     } = req.body;
     const orderId=+req.params.id;
      itemprize = (itemQuantity * (itemprize * (100 - discount))) / 100;
    const updateOrderDetails = {
      text: `
        update orderdetails set itemQuantity=$1,phoneNo=$2,streetNo=$3, state=$4, zipcode=$5, 
        country=$6, status=$7,prize=$8  where orderId=$9
        `,
      values: [
        itemQuantity + prevQuantity,
        phoneNo,
        streetNo,
        state,
        zipcode,
        country,
        status,
        itemprize,
        orderId
      ]
    }; 
    try{
  const result=  await connection.query(updateOrderDetails);
  console.log(result,"updated");
    return true;
    }
    catch(error){
        throw error;
    }

}


const getOrderDetailsById=async (req)=>{

    const getOrderById={
        text:` select * from orderdetails where orderId=$1`,
        values:[req.params.id]
    }

    try{
        const result = await connection.query(getOrderById);
        console.log(result.rows);
        return result.rows;
    } catch(error){
        throw error;
    }

}

module.exports = {
  checkItemQuantity,
  createOrder,
  updateOrderImageUrls,
  updateOrderItemQuantity,
  updateOrder,
  getOrderDetailsById
};