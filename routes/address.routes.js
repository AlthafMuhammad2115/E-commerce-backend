const express =require('express');
const router=express.Router();

module.exports=router;

//Model
const addressModel = require('../model/address.model');
const { default: mongoose } = require('mongoose');

router.post('/setAddress/:userId',async (req,res)=>{
    try{
        const userId=req.params.userId;
        const {firstname,lastname,number,email,housename,area,place,district,state,pincode}=req.body;
        let userAddress=await addressModel.findOne({userId:userId});
        if(userAddress){
            userAddress.address.push({firstname,lastname,number,email,housename,area,place,district,state,pincode});
            await userAddress.save();
        }else{
            userAddress=await addressModel.create({
                userId,
                address:[
                    {
                        firstname,
                        lastname,
                        number,
                        email,
                        housename,
                        area,
                        place,
                        district,
                        state,
                        pincode
                    }
                ]
            })
        }
        res.status(200).send(userAddress)
    }catch(error){
        res.status(402).json({message:error.message});
    }

})

router.patch('/editAddress/:userId',async (req,res)=>{
    try{
        const userId=req.params.userId;
        const {addressId,firstname,lastname,number,email,houseName,area,place,district,state,pincode}=req.body;

        const address={
            _id:addressId,
            id:addressId,
            firstname:firstname,
            lastname:lastname,
            number:number,
            email:email,
            houseName:houseName,
            area:area,
            place:place,
            district:district,
            state:state,
            pincode:pincode
        }
            
        const userAddress=await addressModel.findOneAndUpdate(
            {
                userId:userId,
                address:{$elemMatch:{_id:addressId}}
            },{$set:{address:address}});
        res.send(userAddress)
    }catch(error){
        res.status(402).json({message:error.message});
    }

})

router.get('/getAddress/:userId',async (req,res)=>{
    try{
        const userId=req.params.userId;
        const userAddress=await addressModel.findOne({userId:userId});
        if(userAddress){
            res.status(200).send(userAddress);
        }else{
            res.send("Not Found");
        }
    }catch(error){
        res.status(402).json({message:error.message});
    }
})

router.patch('/deleteAddress/:userId',async (req,res)=>{
    try{
        const userId=req.params.userId;
        const {addressId}=req.body;
        const userAddress=await addressModel.findOneAndUpdate({userId:userId},{$pull:{address:{_id:addressId}}})
        res.send(userAddress)
    }catch(error){
        res.status(402).json({message:error.message});
    }

})