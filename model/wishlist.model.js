const mongoose=require('mongoose')

const wishlistSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    ]
})

module.exports=mongoose.model('wishlistModel',wishlistSchema)