import { generateAuthToken } from "../auth/authController.js";
import User from "../model/userModel.js";
import { resetPasswordEmail } from "./emailController.js";

const emailVerification = async (req, res)=>{
    const {email} = req.body;
    console.log(email);
    
    let user  =  await User.findOne({email: email});
    
    if(!user){
        return res.status(404).send({message: "User not found" , success:false});
    }
    let resetToken = generateAuthToken({ tokenVersion:user.tokenVersion, email: user.email, name: user.name, expiresIn: '5m'});

    console.log(process.env.NODE_ENV === "development");
    
    await resetPasswordEmail({to: email, resetLink: `${process.env.NODE_ENV === "development"
    ? process.env.APP_DEVELOPMENT_LINK
    : process.env.APP_PRODUCTION_LINK}/auth/reset_password?token=${resetToken}`});
    return res.status(200).json({success:true ,data:{message: "Email sent successfully"}});

}

export {emailVerification}