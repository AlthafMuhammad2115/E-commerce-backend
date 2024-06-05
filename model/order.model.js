// const mongoose=require('mongoose')

const { default: mongoose } = require("mongoose");

const orderSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        requied:true
    },
    order:[
        {   
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            },
            orderId:{
                type:String,
                required:true
            },
            razorpay_payment_id:{
                type:String,
                required:true
            },
            razorpay_order_id:{
                type:String,
            },
            razorpay_signature:{
                type:String,
            },
            status:{
                required:true,
                type:Boolean,
                default:false
            }
        }
    ]
})

module.exports=mongoose.model('orderModel',orderSchema);