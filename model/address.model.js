const mongoose= require('mongoose')

const addressSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    address:[
        {
            firstname:{
                type:String,
                required:true
            },
            lastname:{
                type:String,
                required:true
            },
            number:{
                type:Number,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            address:{
                type:String,
                required:true
            },
            
            pincode:{
                type:Number,
                required:true
            }
        }
    ]
    },
    {
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    })
module.exports=mongoose.model('addressModel',addressSchema);