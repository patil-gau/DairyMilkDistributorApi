const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: "product",
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "placed",
    enum : {
        values : ["placed","dispatched","delivered","packed"],
        message : "Order Status should be any of these fields -  [placed,dispatched,delivered,packed]"
    }
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.createIndex({_id:1});
module.exports = mongoose.model("Order", orderSchema);
