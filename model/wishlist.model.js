const mongoose=require('mongoose')

const wishlistSchema=mongoose.Schema({
    productId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId
    },
    name:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    imgUrl:{
        required:true,
        type:String
    },
    category:{
        required:true,
        type:String
    },
    trending:{
        required:true,
        type:Boolean
    }
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
})

module.exports=mongoose.model('productModel',wishlistSchema)