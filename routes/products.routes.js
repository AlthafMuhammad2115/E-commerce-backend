const express=require('express');
const router=express.Router();

module.exports=router

//Model
const productModel=require('../model/product.model')
const products=require('../model/model')


router.get('/GetAllProducts',async(req,res)=>{

    try{
        const productData=await productModel.find();
        if(productData)res.status(200).send(productData)
        else res.send('No products available')
    }catch(error){
        res.status(400).json({message:error.message})
    }
    
})


router.post('/setProducts',async (req,res)=>{
    try{
        const {name,shortDesc,desc,size,price,imgUrl,stock,category,trending}=req.body
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
        })
        res.status(200).send(product)
    }catch(error){
        res.status(404).json({message:error.message})
    }

})

router.patch('/editProducts/:id', async(req,res)=>{

    try{
        const {name,shortDesc,desc,size,price,imgUrl,stock,category,trending}=req.body;
        const productId=req.params.id;
       
        const product={
            _id:productId,
            id:productId,
            name:name,
            shortDesc:shortDesc,
            desc:desc,
            size:size,
            price:price,
            imgUrl:imgUrl,
            stock:stock,
            category:category,
            trending:trending
        }
        productModel.updateOne({_id:productId},{$set:product}).then(
            () => {
                res.status(201).json({
                  message: 'Product updated successfully!',
                });
              }
            ).catch(
              (error) => {
                res.status(400).json({
                  message: error.message
                });
              }
            );

    }catch(error){
        res.status(402).json({message:error.message})
    }
    
})

router.delete('/deleteProducts/:id', async (req,res)=>{
    try{
        const productId=req.params.id;
        await productModel.findOneAndDelete({_id:productId});
        res.status(202).send('Product deleted successfully!');
    }catch(error){
        res.status(402).json({message:error.message})
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

