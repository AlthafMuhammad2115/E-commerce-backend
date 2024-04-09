const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const mongoString = process.env.DATABASE_URL;
const port =3000;

//router module
const userRoutes=require('./routes/user.routes');
const adminRoutes=require('./routes/admin.routes');
const productRoutes=require('./routes/products.routes');
const addressRoutes=require('./routes/address.routes');
const cartRoutes=require('./routes/cart.routes');
const wishlistRoutes=require('./routes/wishlist.routes')
//db

mongoose.connect(mongoString)
const database= mongoose.connection

database.on('error',error=>{
    console.log(error);
})

database.once('connected',()=>{
    console.log('Db Connected');
})


const app=express();

//cors setup

app.use(cors({
    credentials:true,
    origin: ["https://godope-a-clothing-website.vercel.app","http://localhost:4200","*"]
}))

app.options('*', cors());

app.use(express.json())

//routes
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/products',productRoutes)
app.use('/api/address',addressRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/wishlist',wishlistRoutes)

app.listen(port,()=>{
    console.log(`server started at port ${port}`);
})

