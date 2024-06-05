const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client ,GetObjectCommand, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const  { Upload } =require('@aws-sdk/lib-storage');
const { removeBackground } = require("@imgly/background-removal-node"); // Assuming default export


const upload = require("../s3");



module.exports = router;

//Model
const productModel = require("../model/product.model");
const products = require("../model/model");


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;


const s3=new S3Client({
  credentials:{
    accessKeyId:accessKeyId,
    secretAccessKey:secretAccessKey
  },
  region:region
})

//remove bg and UPLOAD FILE TO S3

async function uploadFile(file) {
  try {
    const fileStream = fs.createReadStream(file.path);

    const blob = await removeBackground(file.path);
    const buffer = Buffer.from(await blob.arrayBuffer());
    const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
    
    let filename=file.size.toString()+'-'+file.filename;
    fs.writeFileSync('./public/images/'+filename, dataURL.split(';base64,').pop(), { encoding: 'base64' });
    const rmImg=fs.createReadStream('./public/images/'+filename);
    
    const uploadParams = {

      ACL: 'private',
      Bucket: bucketName,
      Body: rmImg,
      Key: file.filename,
    };

    const uploadS3=new Upload({
      client:s3,
      params:uploadParams
    })

    uploadS3.on("httpUploadProgress", (progress) => {
      console.log(progress);})
    await uploadS3.done();

    await unlinkFile('./public/images/'+filename);
  } catch (error) {
    console.log(error.message);
  }
}



router.get("/GetAllProducts", async (req, res) => {
  try {
    const productData = await productModel.find();

    if (productData) res.status(200).send(productData);
    else res.send("No products available");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/setProducts",upload.single("imgName"),async (req, res, next) => {
  try {
    const file=req.file;
    console.log(file);
    
    uploadFile(file);

    const {
      name,
      shortDesc,
      desc,
      size,
      price,
      stock,
      category,
      trending,
    } = req.body;


    key=file.filename
    BucketParams={
      Bucket:bucketName,
      Key:key
    }
    const command = new GetObjectCommand(BucketParams);
    const imgUrl = await getSignedUrl(s3, command, { expiresIn:604800});


    const product = await productModel.create({
      name: name,
      shortDesc: shortDesc,
      desc: desc,
      size: size,
      price: price,
      imgName: file.filename,
      imgUrl:imgUrl,
      stock: stock,
      category: category,
      trending: trending,
    });
    
    await unlinkFile(file.path);

    res.status(200).send(product);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.patch("/editProducts/:id", async (req, res) => {
  try {
    const {
      name,
      shortDesc,
      desc,
      size,
      price,
      imgUrl,
      stock,
      category,
      trending,
    } = req.body;
    const productId = req.params.id;

    const product = {
      _id: productId,
      id: productId,
      name: name,
      shortDesc: shortDesc,
      desc: desc,
      size: size,
      price: price,
      imgUrl: imgUrl,
      stock: stock,
      category: category,
      trending: trending,
    };
    productModel
      .updateOne({ _id: productId }, { $set: product })
      .then(async () => {
        const productData = await productModel.find();

        res.status(201).send(productData);
      })
      .catch((error) => {
        res.status(400).json({
          message: error.message,
        });
      });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
});

router.delete("/deleteProducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletingProduct=await productModel.findOne({ _id: productId });
    await productModel.findOneAndDelete({ _id: productId });
    BucketParams={
      Bucket:bucketName,
      Key:deletingProduct.imgName
    }
    const deleteImg=new DeleteObjectCommand(BucketParams)
    await s3.send(deleteImg);
    const productData = await productModel.find();

    res.status(200).send(productData);
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
});

router.get("/get/seed", async (req, res) => {
  const productNum = await productModel.countDocuments();
  if (productNum > 0) {
    res.send("seed done alredy");
    return;
  }

  await productModel.create(products);
  res.send("seed done now");
});
