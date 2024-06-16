const express = require("express");
const { model, default: mongoose } = require("mongoose");
const Razorpay = require("razorpay");
const router = express.Router();
const razorpay = require("razorpay");
const ShortUniqueId = require("short-unique-id");
const crypto = require("crypto");

module.exports = router;

// model
const orderModel = require("../model/order.model");
const productModel = require("../model/product.model");

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

// router.post("/orderVerification/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const {
//       productId,
//       orderId,
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//     } = req.body;

//     orderedUser = await orderModel
//       .create({
//         userId,
//         productId,
//         orderId,
//         razorpay_payment_id,
//         razorpay_order_id,
//         razorpay_signature,
//       })
//       .then(async () => {
//         let generatedSignature = crypto
//           .createHmac("SHA256", "D9erksFhOqGaMraxAHXkFvoZ")
//           .update(razorpay_order_id + "|" + razorpay_payment_id)
//           .digest("hex");
//         let isSignatureValid = generatedSignature == razorpay_signature;

//         if (isSignatureValid) {
//           await orderModel.updateOne(
//             { userId: userId, "orderId": orderId },
//             { $set: { "status": true } }
//           );
//           orderedUser = await orderModel.findOne({ userId: userId });
//           res.send(orderedUser);
//         } else {
//           res.send({ message: "not authenticated" });
//         }
//       });
//   } catch (error) {
//     res.status(402).json({ message: "payment failed" });
//   }
// });

router.post("/orderVerification/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      productId,
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      address,
      phone,
      delivery_date,
      size
    } = req.body;

    const orderedUser = await orderModel.create({
      userId,
      productId,
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      address,
      phone,
      delivery_date,
      size
    });

    const generatedSignature = crypto
      .createHmac("SHA256", "D9erksFhOqGaMraxAHXkFvoZ")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const isSignatureValid = generatedSignature === razorpay_signature;

    if (isSignatureValid) {
      await orderModel.updateOne(
        { userId, orderId },
        { $set: { status: true } }
      );

      const updatedUserOrder = await orderModel.findOne({ userId, orderId });

      if (updatedUserOrder) {
        res.status(200).send(updatedUserOrder);
      } else {
        res.status(404).send({ message: "Order not found" });
      }
    } else {
      res.status(401).send({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(402).json({ message: "Payment failed", error: error.message });
  }
});


router.get("/getOrders/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    userId = new mongoose.Types.ObjectId(userId);
    console.log(userId);

    const orders = await orderModel.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: "productmodels",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    if (orders) {
      console.log("worked");
      res.status(200).send(orders);
    } else {
      res.status(402).send({ message: "No Orders palced" });
    }
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
});
