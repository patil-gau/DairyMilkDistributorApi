const Product = require('../models/product.js');

//check capacity/stock
exports.checkStock = async(req,res)=>{
    try {
      const response = {
          status:0,
          msg: "",
          payload:{}
      }
      
      const {userid,productid,date} = req.params;
  
      //check if user exists
      const user = await User.findOne({_id:userid});
      if(!user){
          response.msg = "User doesn't exits. Please register";
          return res.status(401).json(response);  
      }
  
      //get the remaining stock
      const product = Product.findOne({_id:productid,updatedAt:date},{stock:1});

      const remainingStock = product.stock;

      response.msg = "Remaining Stock fetched success";
      response.status = 1;
      response.payload = {
        remainingStock : remainingStock
      }

      return res.send(200).json(response);
      
      
    } catch (error) {
      response.status = 0;
      response.msg = String(error);
      return res.status(500).json(response);
    }
  }