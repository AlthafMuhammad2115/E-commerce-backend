const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const jwt_key=process.env.JWTTOKEN_KEY ;

module.exports=router

// models

const adminsignupModel=require('../model/adminSignUp.model')
//admin login starts

router.post('/signup', async (req,res)=>{

    try{
        const {username,email,password}=req.body;

        const admin=await adminsignupModel.findOne({email});

        if(admin){
            res.json({message:'Mail ID Already Exist',status:302});
            return
        }

        const encryptedPassword=bcrypt.hash(password,10)

        const newModel=new signupModel({
            username:username,
            email:email.toLowerCase(),
            password:await encryptedPassword
        })

        await newModel.save()
        
        res.json({result:'OK',status:200})

        

    }catch(error){
        res.status(400).json({message:error.message})
    }
})

router.post('/login', async (req,res)=>{

    try{
        const{email,password}=req.body;

        const admin=await adminsignupModel.findOne({email})

        if(admin){
            const IsPresent=await bcrypt.compare(password,admin.password);

            if(IsPresent){
                res.status(200).json({token:generateTokenResponse(admin),status:200,result:'FOUND',username:admin.username,userId:admin._id})
            }else{
                res.json({status:302,result:'Password Mismatch'})
            }
        }else{
            res.json({status:400,result:'Email not found'})
        }
    }catch(error){
        res.status(400).json({message:error.message})
    }
})

generateTokenResponse=(admin)=>{
    const token= jwt.sign({data:admin},jwt_key,{expiresIn:'30d'});
    return token;
}

//Admin login ends

