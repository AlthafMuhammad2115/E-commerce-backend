const express =require('express');
const router =express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const jwt_key=process.env.JWTTOKEN_KEY ;

const signupModel = require('../model/signup.model');
const cartModel =require('../model/cart.model');
module.exports=router



router.post('/SignUp', async (req,res)=>{

    try{
        const {username,email,password}=req.body;

        const user=await signupModel.findOne({email});

        if(user){
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
        
        const userdet=await signupModel.findOne({email})
        let userId=userdet._id
        const newCart=await cartModel.create({
            userId,
            products:[]
        })
        
        res.json({result:'OK',status:200,cart:newCart})

        

    }catch(error){
        res.status(400).json({message:error.message})
    }
})

router.post('/login', async (req,res)=>{

    try{
        const{email,password}=req.body;

        const user=await signupModel.findOne({email})

        if(user){
            const IsPresent=await bcrypt.compare(password,user.password);

            if(IsPresent){
                res.status(200).json({token:generateTokenResponse(user),status:200,result:'FOUND',username:user.username,userId:user._id})
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

generateTokenResponse=(user)=>{
    const token= jwt.sign({data:user},jwt_key,{expiresIn:'30d'});
    return token;
}

// CART STARTS

// add to cart 


// cart ends

// wishlist starts

// wishlist ends