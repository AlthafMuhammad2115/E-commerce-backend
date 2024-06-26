const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    shortDesc:{
        required:true,
        type:String
    },
    desc:{
        required:true,
        type:String
    },
    size:{
        required:true,
        type:[String]
    },
    price:{
        required:true,
        type:Number
    },
    imgName:{
        required:true,
        type:String
    },
    imgUrl:{
        // required:true,
        type:String
    },
    stock:{
        required:true,
        type:Number
    },
    category:{
        required:true,
        type:String
    },
    trending:{
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

module.exports=mongoose.model('productModel',productSchema)