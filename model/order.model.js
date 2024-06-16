const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    requied: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  status: {
    required: true,
    type: Boolean,
    default: false,
  },
  address:{
    type:String,
    required:true
  },
  phone:{
    required:true,
    type:Number
  },
  delivery_date:{
    type:Date,
    required:true
  },
  size:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("orderModel", orderSchema);
