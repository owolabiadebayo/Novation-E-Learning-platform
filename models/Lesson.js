// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url);

import mongoose from 'mongoose'; 

const lessonSchema= new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minlength: 3,
        maxlength:30,
    },
    slug:{
        type:String,
        lowercase:true
    },

    content:{
        type:Object,
        minlength: 10
    },
    videolink:{
        type:Object,
        required: true
    },
    free_preview:{
        type:Boolean,
        default: false
    }
}, 
{timestamps:true});
export default mongoose.model("Lesson", lessonSchema);

