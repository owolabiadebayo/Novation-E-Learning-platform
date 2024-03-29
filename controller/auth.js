import jwt from 'jsonwebtoken'
import User from "../models/User.js";
// import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import bcrypt from 'bcrypt'

// //AWS EMAILING

// const awsconfig= {
//     accessKeyId: process.env.AWS_ACCESS_KEY_IDS,
//     secretAccessKey:process.env.AWS_SECRET_ACCESS_KEYS,
//     region:process.env.AWS_REGIONS,
//     apiVersion:process.env.AWS_API_VERSIONS,
// };
// const SES =  new AWS.SES(awsconfig);


// export const sendTestEmail =async (req, res)=>{
    
//     const params = {
//         Source: process.env.EMAIL_FROM,
//         Destination:
//         {
//             ToAddresses: ['owolabiadebayo78@gmail.com'],
//         },
//         ReplyToAddresses: [process.env.EMAIL_FROM],
//         Message:{
//             Body:{
//                 Html:{
//                     Charset: "UTF-8",
//                     Data:  `
//                             <html>
//                             <h1>RESET PASSWORD FOR YOUR ACCOUNT</h1>
//                             <p>
//                             Click on the below link to reset your email:
//                             For any queries or complaints contact our support on 08160197959

//                             </p>
//                             </html>

//                     `
//                 }
//             },
//             Subject:{
//                 Charset:"UTF-8",
//                 Data: "Reset Password for your GMTsoftware Account"

//             }
//         }

//     };
//     const sendemail=  SES.sendEmail(params).promise();
//     sendemail.then((data)=>{
//         console.log(data);
//         res.status(200).json({ok:true});
//     }).catch((err)=> {
//         console.log(err);
//         res.status(500).json("Sending email unsuccessful");
//     });

// };


/////////////////////////////////////////////////

// status 500 for internal server error 
// status 401 for invalid authorisation

export const register= async (req, res)=>{
    try{

        let {name,email,contact,password}= req.body;

        //validation
        if(!name) return res.status(400).json("Name is required");

        if(!password || password.length < 6) return res.status(400).json("Password is required and should be minimum 6 characters long");

        const usrexist= await User.findOne({email});

        if(usrexist)  return res.status(400).json("The email is already taken");

        //password hashing
        password = await bcrypt.hash(password, 12);  //hashing with  12 rounds of salt 

        //new user create
        const newuser=  new User({
           name: name,
           email: email,
           contact:contact,
           password: password
        });
        console.log("hello");
        await newuser.save();
         res.status(200).json("Register Successful");
    }
    catch(err)
    {
        return res.status(500).json("Internal server error");
    }
}
export const login= async(req, res)=>{
    try{
    const {email, password}= req.body;
    console.log(req.body);
    const user=await  User.findOne({email});
    if(!user) return res.status(403).json("Invalid username or password");
    const comp= await bcrypt.compare(password, user.password);
    if(!comp) return res.status(403).json("Invalid username or password");
    // no issues generate jwt token
    const token= jwt.sign({userid: user._id}, process.env.JWT_SECRET , {expiresIn: "20h"});  // user login for 30 days

     res.cookie("token", token);
     user.password=undefined;  // because we dont want to send password and userid in global state
     user._id= undefined;
     res.status(200).json(user);
    }
    catch(err)
    {
       return  res.status(500).json("Internal server error");
    }

}

// clearing cookie on backend
export const logout= async (req, res)=>{
    try{
    res.clearCookie("token");
    res.status(200).json("Succesfully signed out");
    }
    catch(err)
    {
      return  res.status(500).json("Internal server error");
    }

}

//getting current user after jwt verify
export const currentUser= async (req, res)=>{
    try{
         const user = await User.findById(req.user._id).select('-password').exec;  //excluding password
        // console.log("Current_user",user);
         return res.status(200).json({ok:true});
    }       
    catch(err)
    {
        return  res.status(500).json("Internal server error");
    }
}

export const generateOtp=async(req, res)=>{
    // use jwt for otp so that we can use timestamps (5min validation)
    try{
    const {email}= req.body;
    const id= nanoid(6);
    console.log(id);
    const user= await User.findOneAndUpdate({email}, {forgot_password_id:id});
    if(!user) return res.status(400).json("Invalid Email");
    
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination:
        {
            ToAddresses: [req.body.email],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message:{
            Body:{
                Html:{
                    Charset: "UTF-8",
                    Data:  `
                            <html>
                            <h3>RESET PASSWORD REQUEST</h3>
                            <p>
                            Your OTP for reseting the password is: <b>${id}</b>
                            </p>
                            <h5>
                            For any queries or complaints contact our support on 9654004473
                            </h5>

                           
                            </html>

                    `
                }
            },
            Subject:{
                Charset:"UTF-8",
                Data: "Reset Password for your CourseBay Account"

            }
        }

    };
    const sendemail= SES.sendEmail(params).promise();
    sendemail.then((data)=>{
        console.log(data);
        res.status(200).json("Successfully sent the email");
    }).catch((err)=> {
        console.log(err);
    });
    
    }
    catch(err)
    {
        res.status(500).json("Internal Server Error");
    }
    

}

export const verifyOtp=async (req, res)=>{
    try{
    const {email , otp} = req.body;
    const user= await User.findOne({email});
    if(!user) return res.status(400).json("This is not allowed");
    console.log(user);
    if(otp === user.forgot_password_id) return res.status(200).json("Successfully verified your email");
    return res.status(402).json("Your OTP didn't match with the provided one");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const changePassword = async(req, res)=>{

    try{
        let  {email, otp, password} = req.body;
        const user= await User.findOne({email});
        if(!user) return res.status(400).json("This is not allowed");
        if(otp !== user.forgot_password_id) return res.status(402).json("Your OTP didn't match with the provided one");
        if(!password || password.length < 6) return res.status(400).json("Password is required and should be minimum 6 characters long");
        password = await bcrypt.hash(password, 12);  //hashing with  12 rounds of salt 
        const update_pass=await User.findOneAndUpdate({email}, {password: password});
        if(!update_pass) return res.status(400).json("Some error occured");
        return res.status(200).json("Password changed successfully")
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const getUser=async(req, res)=>{
    try{
        const id= req.user.userid;
        const my_user= await User.findById(id).select('-password').exec();
        return res.status(200).json(my_user);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const updateUser= async(req, res)=>{
    try{
        const id= req.user.userid;
        const {name, contact, interest}= req.body;
        const my_user= await User.findByIdAndUpdate(id,{
            name:name,
            contact:contact,
            interest: interest
        } );

        return res.status(200).json("Updated user");

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}