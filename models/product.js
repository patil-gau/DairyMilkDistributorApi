const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true,
    maxlength: [120, "Product name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "please provide product price"],
    maxlength: [6, "Product price should not be more than 6 digits"],
  },
  description: {
    type: String,
    required: [true, "please provide product description"],
  },
  stock: {
    type: Number,
    required: [true, "please add a number in stock"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
