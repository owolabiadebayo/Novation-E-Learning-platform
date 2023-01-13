// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url);

import mongoose from 'mongoose'; 

// to create order after successfull payment 
// Razorpay orders if required later can be used

const orderSchema= new mongoose.Schema(
    {
        isPaid: Boolean,

        amount: Number,

        razorpay:{
            orderId: String,
            paymentId: String,
            signature: String,
        }

    });


export default mongoose.model("Order", orderSchema)