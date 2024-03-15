const express=require('express')
const router=express.Router()
module.exports=router

// models
const productModel=require('../model/product.model')


// const { default: mongoose } = require('mongoose');


router.post('/setProducts',async (req,res)=>{
    try{
        const {name,shortDesc,desc,size,price,imgUrl,stock,category,trending,wishlist}=req.body
        const product=await productModel.create({
            name:name,
            shortDesc:shortDesc,
            desc:desc,
            size:size,
            price:price,
            imgUrl:imgUrl,
            stock:stock,
            category:category,
            trending:trending,
            wishlist:wishlist
        })
        res.status(200).send(product)
    }catch(error){
        res.status(404).json({message:error.message})
    }

})
