const mongoose=require('mongoose')

const adminSignUpSchema=new mongoose.Schema({
    username:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    }
})

module.exports=mongoose.model('adminSignup',adminSignUpSchema)