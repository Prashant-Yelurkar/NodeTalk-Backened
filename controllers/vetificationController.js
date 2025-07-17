import { generateAuthToken } from "../auth/authController.js";
import User from "../model/userModel.js";
import { resetPasswordEmail } from "./emailController.js";

const emailVerification = async (req, res)=>{
    const {email} = req.body;
    console.log(email);
    
    let user  =  await User.findOne({email: email});
    console.log(user);
    
    if(!user){
        return res.status(202).json({message: "User not found"});
    }
    let resetToken = generateAuthToken({ email: user.email, name: user.name, expiresIn: '5m'});
    await resetPasswordEmail({to: email, resetLink: `${process.env.APP_LINK}/auth/reset_password?token=${resetToken}`});
    return res.status(200).json({message: "Email sent successfully"});

}

export {emailVerification}