const express =require('express');
const router =express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const jwt_key=process.env.JWTTOKEN_KEY;

const products=require('../model/model')
const productModel=require('../model/product.model');
const signupModel = require('../model/signup.model');
const cartModel =require('../model/cart.model');
const { default: mongoose } = require('mongoose');
module.exports=router

router.get('/GetAllProducts',async(req,res)=>{

    try{
        const productData=await productModel.find();
        if(productData)res.status(200).send(productData)
        else res.send('No products available')
    }catch(error){
        res.status(400).json({message:error.message})
    }
    
})

router.get('/get/seed',async(req,res)=>{
    const productNum=await productModel.countDocuments();
    if(productNum>0){
        res.send('seed done alredy')
        return
    }

    await productModel.create(products)
    res.send('seed done now')
})


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
router.post('/cart',async (req,res)=>{
    try{
        const {userId,productId, quantity, name, price, imgUrl}=req.body;
        let cart=await cartModel.findOne({userId})

        if(cart){
            const cartIndex= cart.products.findIndex(p=>p.productId==productId);
            if(cartIndex>-1){
                let productItem = cart.products[cartIndex];
                productItem.quantity++;
                cart.products[cartIndex] = productItem;
            }else{
                cart.products.push({ productId, quantity, name, price, imgUrl });
            }
            cart.subTotal+=price;

        }
        cart = await cart.save();
        res.status(200).send(cart)

    }catch(error){
        res.status(402).json({message:error.message});
    }
})

// get from the cart

router.get('/getCart/:userId',async(req,res)=>{
    try{
            userId =new mongoose.Types.ObjectId(req.params.userId) 
        const cartDetials= await cartModel.findOne({userId:userId})
        if(cartDetials){
            res.status(200).send(cartDetials)
        }else{
            res.send('Cart not found')
        }

    }catch(error){
        res.status(402).json({message:error.message});
    }
})

// delete an item of the cart
router.patch('/deleteCartItem/:userId',async (req,res)=>{
    try{
        const userId=new mongoose.Types.ObjectId(req.params.userId);
        const {productId}=req.body;
        let cart=await cartModel.findOne({userId:userId});
        if(cart){
                 const cartIndex= cart.products.findIndex(p=>p.productId==productId);
                if(cartIndex>-1){
                    cart.subTotal-=cart.products[cartIndex].price*cart.products[cartIndex].quantity;
                    cart.products.splice(cartIndex,1);
                }
            
        }
        cart =await cart.save();
        res.send(cart);
    }catch(error){
        res.status(402).json({message:error.message})
    }
    

})

// delete all the items of the cart

router.delete('/deleteCartAllItem/:userId',async (req,res)=>{
    try{
        const userId=new mongoose.Types.ObjectId(req.params.userId);
        let cart=await cartModel.findOne({userId:userId});
        if(cart){
            cart.products=[]
            cart.subTotal=0
        }
        cart =await cart.save();
        res.send(cart)
    }catch(error){
        res.status(402).json({message:error.message});
    }
    
})

// cart ends

// wishlist starts


// wishlist ends