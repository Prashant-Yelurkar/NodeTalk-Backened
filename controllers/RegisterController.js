import User from '../model/userModel.js';
import { verifyGoogleIdToken } from '../controllers/googleAuthController.js';
import { generateAuthToken } from '../auth/authController.js';
import { welcomeEmail, loginEmail } from '../controllers/emailController.js';
import bcrypt from 'bcrypt';
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userData = {
    name,
    email,
    password : await bcrypt.hash(password, 10),
  };

  await register(userData, res, true); 
};


const registerUserFromGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    const googleUser = await verifyGoogleIdToken(token);
    const { email, name, picture } = googleUser;

    const userData = {
      name,
      email,
      profile: picture,
      isGoogleUser: true,
    };

    await register(userData, res, false); 
  } catch (err) {
    console.error('Google registration/login failed:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Google register failed',
    });
  }
};

const register = async (data, res, isManual) => {
  try {
    let user = await User.findOne({ email: data.email });
    let isNewUser = false;

    if (user && isManual) {
      return res.status(202).json({
        success: false,
        message: 'User already exists, please login',
      });
    }

    if (!user) {
      user = new User({
        ...data,
      });
      await user.save();
      isNewUser = true;
    }

    const appJWT = generateAuthToken(user);

    if (isNewUser) {
      await welcomeEmail({ to: user.email });
      return res.status(200).json({
        success: true,
     
        message: '✅ Registration Successful',
        jwt: appJWT,
       
      });
    } else {
      await loginEmail({ to: user.email });
      return res.status(200).json({
        success: true,
    
          message: '✅ Login Successful',
          jwt: appJWT,
     
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during registration.',
    });
  }
};

export { registerUser, registerUserFromGoogle };
