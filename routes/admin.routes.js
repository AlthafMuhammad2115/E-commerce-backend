const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

module.exports=router

// models
const productModel=require('../model/product.model')
const adminsignupModel=require('../model/adminSignUp.model')

//product starts
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

//product ends

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

