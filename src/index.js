const express=require('express')
const router=require('./router/route')
const app=express()
app.use(express.json());
// const multer=require('multer')
// app.use(multer().any())


const mongoose = require("mongoose");
       
    mongoose.connect("mongodb+srv://ABHI:1rgLK1SKF60O1lEF@cluster0.skx8q.mongodb.net/strix",{
        useNewUrlParser: true,
    })
    .then(()=>{
        console.log("connected to database");
    }).catch((err)=>{
        console.log(err);
    })

app.use('/',router)
const port=process.env.PORT||8080;
app.listen(port,()=>{
    console.log(`server running at port ${port}`)
})

