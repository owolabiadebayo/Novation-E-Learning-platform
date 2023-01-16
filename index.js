// import { createRequire } from "module"
// const require = createRequire(import.meta.url);
// import express from 'express';
const express = require('express')
import cors from 'cors';
import morgan from 'morgan';
// import {readdirSync} from 'fs';
const fs= require('fs');
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import mongoose from 'mongoose'; // for database 
import dotenv from 'dotenv';
dotenv.config();
// for environment variables
//////////////////////////////////mongoose connect////////////////////////////////////
// in mongoose.connect we need to paas database url in mongo atlas which we are extracting from env using dotenv module 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}). then(()=>{console.log("DB connected");}).catch(err=>console.log("err in connecting DB"+ err))  // mongoose.connect returns a promise
////////////////////////////////////////////////////////////////////////////////////

const app = express();
const maxRequestBodySize = '1mb';
app.use(express.json({limit: maxRequestBodySize}));
app.use(express.urlencoded({ extended: true }));


//middlewares 
app.use(cors());
//app.use(express.json());  
app.use(morgan("dev")); // for status codes and errors 
app.use(cookieParser());

const csrfProtection= csrf({cookie:true});


 app.use(csrfProtection);
// // defining routes
// readdirSync('./routes').forEach(async (r) => {
//     const route = await import(`./routes/${r}`)
//     console.log(route);
//     app.use('/api', route)
//   })

fs.readdirSync("./routes").map((r)=>{
    app.use("/api" , require(`./routes/${r}`));
   
 })
  

app.get('/api/csrf-token', (req, res)=>{
    console.log(req.csrfToken());
    return res.status(200).json({csrfToken: req.csrfToken()});
})

const host = '0.0.0.0'
app.listen(process.env.PORT || 8000 ,host , ()=>{
    console.log(`server is running on ${8000}`);
})


