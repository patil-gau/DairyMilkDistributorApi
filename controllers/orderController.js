const Order = require('../models/order.js');
const Product = require('../models/product.js');
const redisClient = require('../config/redisClient');
const User = require('../models/user.js');
const redisClient = require('../config/redisClient.js');


//connect to register store
(async function (){ await redisClient.connect()})();


//add a new order
exports.addOrder = async(req,res)=>{
    try {
        const response = {
            status:0,
            msg: "",
            payload:{}
         }
         const {userid} = req.params;
         const {orderItems,paymentInfo,totalAmount,orderStatus} = req.body;

        
         //validate if information is provided by user
         if(!(id && orderItems && paymentInfo && totalAmount)){
            response.msg = "All fields are required";
            return res.status(400).json(response);
         }
          
         //check if user exists
          const user = await User.findOne({_id:userid});
          if(!user){
               response.msg = "User doesn't exits. Please register";
               return res.status(401).json(response);
          }
        
        const orderObj = {
            orderItems,
            paymentInfo,
            totalAmount,
            orderStatus
        }

        //create a new order
        const newOrder = await Order.create(orderObj);

        //decrement the stock of the product
        productIds = []
        orderItems.forEach(element => {
            productIds.push(element.product);
        });

        await Product.findOneAndUpdate(
        {_id:{$in:productIds}},
        {$inc:{'stock':-1}},
        {new: true},
        (err,data)=>{
            if(!err){
                response.msg = "New Order Created Successfully";
                response.status = 1;
                response.payload = newOrder;
                return res.status(200).json(response);
            }
           response.status = 0;
           response.msg = String(err);
           return res.status(500).json(response);   
        });
    } catch (error) {
        response.status = 0;
        response.msg = String(error);
        return res.status(500).json(response);
    }
}


// update order using order id
exports.updateOrder = async(req,res)=>{
    try {
        const response = {
            status:0,
            msg: "",
            payload:{}
         }
        const {userid,orderid} = req.params;
        const {orderItems,paymentInfo,totalAmount,orderStatus} = req.body;

        //validate if information is provided by user
        if(!(id && orderItems && paymentInfo && totalAmount)){
        response.msg = "All fields are required";
        return res.status(400).json(response);
        }
        
        //check if user exists
        const user = await User.findOne({_id:userid});
        if(!user){
            response.msg = "User doesn't exits. Please register";
            return res.status(401).json(response);
        }

        //update the order
        const orderObj = {
            orderItems,
            paymentInfo,
            totalAmount,
            orderStatus,
            updatedAt : new Date()
        }

        const updatedOrder =  await Order.findOneAndUpdate({_id:orderid,user:userid},orderObj,{
            upsert:true,  //if no order is found then create new order
            new: true
        },(err,data)=>{
        if(!err){
            response.msg = "Order Updated Successfully";
            response.status = 1;
            response.payload = updatedOrder;
            return res.status(200).json(response);   
        }
       //failed to update
       response.status = 0;
       response.msg = String(err);
       return res.status(500).json(response);   
        })
   
    } catch (error) {
        response.status = 0;
        response.msg = String(error);
        return res.status(500).json(response);
    }
}

// update order status using id
exports.updateOrderStatus = async(req,res)=>{
  try {

    const response = {
        status:0,
        msg: "",
        payload:{}
     }

    const {userid,orderid} = req.params;
    const {orderStatus} = req.body;

    //check if user exists
    const user = await User.findOne({_id:userid});
    if(!user){
        response.msg = "User doesn't exits. Please register";
        return res.status(401).json(response);
    }

    if(!orderStatus){
        response.status = 0;
        response.msg = "orderStatus is required";
        return res.send(400).json(response);
    }

    if(!(orderStatus=="placed" || orderStatus=="packed" || orderStatus=="dispatched" || orderStatus=="delivered")){
        response.status = 0;
        response.msg = "orderStatus should be any of these - [placed,packed,dispatched,delivered]";
        return res.send(400).json(response);
    }

    const nowDate = new Date();

    //update order status
    await Order.findOneAndUpdate({_id:orderid,user:userid},{$set:{orderStatus:orderStatus,updatedAt:nowDate}},{
        new:true
    },(err,data)=>{
       if(!err){
        response.msg = "Order Status Updated Successfully";
        response.status = 1;
        response.payload = data;
        return res.status(200).json(response); 
       }
 
       //failed to update
       response.status = 0;
       response.msg = String(err);
       return res.status(500).json(response);
    });
  
  } catch (error) {
    response.status = 0;
    response.msg = String(error);
    return res.status(500).json(response);
  }
}

//delete a order using id
exports.deleteOrder = async(req,res)=>{
    try {
    const response = {
        status:0,
        msg: "",
        payload:{}
    }
    
    const {userid,orderid} = req.params;

    //check if user exists
    const user = await User.findOne({_id:userid});
    if(!user){
        response.msg = "User doesn't exits. Please register";
        return res.status(401).json(response);  
    }

    //delete the order
    await Order.findOneAndDelete({_id:orderid,user:userid},(err,data)=>{
        if(!err){
            response.msg = "Order Deleted Successfully";
            response.status = 1;
            response.payload = data;
            return res.status(200).json(response); 
           }
     
           //failed to delete
           response.status = 0;
           response.msg = String(err);
           return res.status(500).json(response);

    });

    } catch (error) {
    response.status = 0;
    response.msg = String(error);
    return res.status(500).json(response);
    }
}

//get all orders in paginated form
exports.getOrders = async(req,res,next)=>{
    const ORDERS_LIMIT = 10;
    const defaultOffset = 0;
 
    const response = {
         status :0,
         msg : "",
         payload : {}
    }
 
    try {
         //grab the limit and offset
         let {limit,offset} = req.query;
 
         //if no limit and offset is provided then use default offset
         if(!limit){      
             limit = ORDERS_LIMIT;
         }
         if(!offset){
             offset = defaultOffset;
         }
 
         //both offset and limit should be positive numbers
         if(!(limit>0 && offset>=0)){
             response.msg = "limit should be greater than 0 and offset should be non-negative"
             return res.status(400).json(response);
         }
 
         // if limit provided by user is more than max limit then don't send data more than max limit
         if(limit>ORDERS_LIMIT){
             limit = ORDERS_LIMIT;
           }
 
         //check if the data is available in redis cache    
         const cachedData = await redisClient.get(offset.toString());  
         if(cachedData){
             console.log(`[INFO] Retrieving values from Cache`);
             const data = JSON.parse(cachedData);
             response.data = data;
             response.status = 1;
             return res.status(200).json(response);
         }
         else
          {
             console.log(`[INFO] Data not cached makes DB Query`);
          }      
 
         //get the data from database
         const orders = await Order.find({user:userid}).sort({_id:1}).skip(offset).limit(limit);
         let key = offset.toString();
         let value = JSON.stringify(orders);
 
         //store orders in cache and set expiry to 30 mins
         await redisClient.setEx(key,1800,value);
 
         response.data = orders;
         response.status = 1;
         response.msg = "Success";
         return res.status(200).json(response);
         
    } catch (error) {
       console.log(`[ERROR] ${String(error)}`);
       response.msg = "Failed to load data. Please try again"
       return  res.status(500).json(response);
    }
 }

