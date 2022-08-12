const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : [true,"Full Name is a required field"],
        maxlength : [30,"Full Name should not be greater than 30 characters"]   
    },
    email : {
       type : String,
       required : [true,"Email is required field"],
       unique : true,
       validate : [validator.isEmail,"Please enter correct email"]
    },
    phone : {
       type : String,
       required : [true,"Phone number is required field"],
       unique : true,
       maxlength : [10,"Phone Number cannot be greater than 10 digits"]
    },
    password : {
       type : String,
       required : [true,"Please provide a password"],
       minlength : [6,"Password should be atleast 6 characters long"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

const User =  mongoose.model('User',userSchema);

//create a index for faster querying
User.createIndexes({email:1});
module.exports = User;


