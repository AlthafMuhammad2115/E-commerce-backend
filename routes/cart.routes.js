const express=require('express');
const router=express.Router();

module.exports=router

//Model
const cartModel =require('../model/cart.model');

const mongoose=require('mongoose')

router.post('/setCart',async (req,res)=>{
    try{
        const {userId,productId, quantity, name, price, imgUrl}=req.body;
        let cart=await cartModel.findOne({userId});

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