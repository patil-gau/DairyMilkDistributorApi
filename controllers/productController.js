const Product = require('../models/product.js');
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user.js');

//check capacity/stock
exports.checkStock = async(req,res)=>{
  const response = {
    status:0,
    msg: "",
    payload:{}
}
    try {
      const {userid,productid,date} = req.params;
  
      //check if user exists
      const user = await User.findOne({_id: new ObjectId(userid)});
      if(!user){
          response.msg = "User doesn't exits. Please register";
          return res.status(401).json(response);  
      }

      //get the remaining stock
      const product = await Product.findOne({_id:productid,$and:[{"updatedAt":{ $gte :`${date}T00:00:00.000Z`}},{"updatedAt": { $lte : `${date}T23:59:59.000Z`}}]});
      
      if(product){
        const remainingStock = product.stock;
        response.msg = "Remaining Stock fetched success";
        response.status = 1;
        response.payload = {
        remainingStock : remainingStock
          }
        return res.status(200).json(response);
      }

      response.msg = "No Product Available or No Stock is Available";
      response.status = 1;
      response.payload = {
      remainingStock : 0
        }
      return res.status(200).json(response);
            
    } catch (error) {
      response.status = 0;
      response.msg = String(error);
      return res.status(500).json(response);
    }
  }