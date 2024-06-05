const express = require("express");
const { model } = require("mongoose");
const Razorpay = require("razorpay");
const router = express.Router();
const razorpay = require("razorpay");
const ShortUniqueId = require("short-unique-id");
const crypto = require("crypto");

module.exports = router;

// model
const orderModel = require("../model/order.model");

const rzrp = new Razorpay({
  key_id: "rzp_test_l2EHS214It8uXe",
  key_secret: "D9erksFhOqGaMraxAHXkFvoZ",
});

router.post("/razorpay", async (req, res, next) => {
  var shortid = new ShortUniqueId({ length: 10 });
  const options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: shortid.rnd(),
    payment_capture: 1,
  };

  try {
    const response = await rzrp.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      reciept: response.receipt,
    });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
});

router.post("/orderVerification/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      productId,
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    let orderedUser = await orderModel.findOne({ userId: userId });
    if (orderedUser) {
      orderedUser.order.push({
        productId,
        orderId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      await orderedUser.save();
    } else {
      orderedUser = await orderModel.create({
        userId,
        order: [
          {
            productId,
            orderId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
        ],
      });
    }

    let generatedSignature = crypto
      .createHmac("SHA256", "D9erksFhOqGaMraxAHXkFvoZ")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    let isSignatureValid = generatedSignature == razorpay_signature;

    if(isSignatureValid){
        await orderModel.updateOne({userId:userId,"order.orderId":orderId},{$set:{"order.$.status":true}});
        orderedUser=await orderModel.findOne({userId:userId});
        res.send(orderedUser)
    }else{
        res.send("not authenticated");
    }

  } catch (error) {
    res.status(402).json({ message: "payment failed" });
  }
});
