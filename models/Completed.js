// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url);
import mongoose from 'mongoose'; 
// new Course created by instructor 
// each course will have many lessons given by the lesson schema


const {ObjectId}= mongoose.Schema;   //in a way to give mongoose.Schema.ObjectId as type

const completedSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref:'User',
    },
    course:{
        type: ObjectId,
        ref: 'Course'
    },
    lesson:{
        type:ObjectId, 
        ref:'Lesson'
    }
},
{timestamps:true});

export default mongoose.model("Completed", completedSchema);



