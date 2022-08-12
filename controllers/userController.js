const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.SECRET;

exports.register = async (req,res,next)=>{

  //default response payload
  const response = {
        status : 0,
        msg : "",
        data : {}
    } 

  try {
    //grab the data from request body
    const {fullname,email,phone,password} = req.body;

    //validate if all fields are non-empty
    if(!(email && fullname && phone && password)){

    }

    //check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    //create new user object
    const userObject = {
        fullname,
        email,
        phone,
        password : hashedPassword,
        createdAt : new Date()
    }

    //save the user in the database
    const newUser = await User.create(userObject);

    // don't send password to user
    newUser.password = undefined;

    //generate a token
    const token  = jwt.sign(
          { userId : newUser._id, email },
           SECRET,
          { expiresIn : '7d' }
        );

    //create a response payload
    response.status = 1;
    response.msg = "User created successfully";
    response.data = {
        fullname:newUser.fullname,
        email : newUser.email,
        phone : newUser.phone,
    };

    //sending token in httpOnly cookie for security 
    res.cookie('token',token,{ 
      'expires': new Date(Date.now() + 604800),   //expires in 7 days
      'httpOnly' : true,
      'secure' : false    //set to true in case of https
    })
    res.status(201).json(response);
 
   } catch (error) {
      response.msg = String(error)
      res.status(500).json(response);
  }
}