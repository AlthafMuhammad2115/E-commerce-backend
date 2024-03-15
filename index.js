const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const mongoString = process.env.DATABASE_URL;


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


app.use(cors({
    credentials:true,
    origin:["*"]
}))

app.use(express.json())

//routes
app.use('/api',userRoutes)
app.use('/api/admin',adminRoutes)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

