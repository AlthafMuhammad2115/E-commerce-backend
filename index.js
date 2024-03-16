const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const mongoString = process.env.DATABASE_URL;
const port =process.env.PORT || 3000;

//router module
const userRoutes=require('./routes/user.routes')
const adminRoutes=require('./routes/admin.routes')

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
    origin: ["https://godope-a-clothing-website.vercel.app","http://localhost:4200"]
}))

app.options('*', cors());

app.use(express.json())

//routes
app.use('/api',userRoutes)
app.use('/api/admin',adminRoutes)


app.listen(port,'0.0.0.0')

