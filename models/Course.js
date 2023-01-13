// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url);
import mongoose from 'mongoose'; 
// new Course created by instructor 
// each course will have many lessons given by the lesson schema


const {ObjectId}= mongoose.Schema;   //in a way to give mongoose.Schema.ObjectId as type

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength:5,
        maxlength: 50,
        trim:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:String,
    published:{
        type: Boolean,
        default:true
    },
    paid:{
        type:Boolean,
        default: true
    },
    price:{
        type:Number,
        required: true,
        default:100
    },
    description:{
        type:String,
        minlength:5,
    },
    image:{
        type: {}
    },
    instructor:{
        type: ObjectId,
        ref:'User',
        required: true
    },
    users:{
        type: Array
    },
    lessons:[{type:{} , ref:'Lesson'}]
},
{timestamps:true});

export default mongoose.model("Course", courseSchema);


