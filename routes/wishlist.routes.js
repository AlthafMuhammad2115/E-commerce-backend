const express=require('express');
const router=express.Router();

module.exports=router;

//model
const wishlistModel=require('../model/wishlist.model')

router.post('/setWishlist/:userId',async (req,res)=>{
    try{
        const userId=req.params.userId;
        const {productId}=req.body;
        let wishlist=await wishlistModel.findOne({userId});
        if(wishlist){
            const index=wishlist.productId.findIndex(p=>p==productId);
            console.log(index);
            if(index>-1){
                res.send("Item already exist");
                return;
            }else{
                wishlist.productId.push(productId);
            }
            wishlist.save();
        }else{
            wishlist=await wishlistModel.create({
                userId,
                productId:[
                    productId
                ]
            })
        }
        res.status(200).send(wishlist);

    }catch(error){
        res.status(400).json({message:error.message});
    }
})

router.get('/getWishlist/:userId',(req,res)=>{
    const userId=req.params.userId;
    return;

})

router.patch('/deleteWishlist/:userId',async(req,res)=>{
    const userId=req.params.userId;
    const {productId}=req.body;
    const wishlist=await wishlistModel.updateOne({userId:userId},{$pull:{productId:productId}})
    res.send(wishlist);
})
