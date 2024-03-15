const mongoose =require('mongoose');

const cartSchema=mongoose.Schema({
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       required:true
    },
    subTotal:{
        type:Number,
        default:0
    },
    products:[
        {
            productId: String,
            name: String,
            price: Number,
            size:String,
            imgUrl:String,
            quantity: Number
        }
    ]

})

module.exports=mongoose.model('cartModel',cartSchema)