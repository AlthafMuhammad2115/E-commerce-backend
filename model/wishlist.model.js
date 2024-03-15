const mongoose=require('mongoose');

const wishlistSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
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