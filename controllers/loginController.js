import User from '../model/userModel.js';
import { generateAuthToken } from '../auth/authController.js';
import { welcomeEmail, loginEmail } from '../controllers/emailController.js';
import { verifyGoogleIdToken } from '../controllers/googleAuthController.js';
import bcrypt from 'bcrypt';


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userData = { email, password }; 
  await login(userData, res, true);
};

const loginUserFromGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    const googleUser = await verifyGoogleIdToken(token);
    const { email, name, picture } = googleUser;

    const userData = {
      name,
      email,
      profile: picture,
    };
    await login(userData, res, false); 
  } catch (err) {
    console.error('Google login failed:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Google login failed',
    });
  }
};

const login = async (data, res, isManual) => {
  try {
    let user = await User.findOne({ email: data.email });
    let isNewUser = false;

    if (isManual) {
      if (!user) {
        return res.status(202).json({
          success: false,
          message: 'User not found. Please register first.',
        });
      }
      console.log(data.password, user.password);
      
      const isMatch = user.password ?await bcrypt.compare(data.password, user.password) : false;
      if (!isMatch) {
        return res.status(202).json({
          success: false,
          message: 'Invalid password',
        });
      }
    }

    if (!user && !isManual) {
      user = new User({
        name: data.name,
        email: data.email,
        profile: data.profile,
      });
      await user.save();
      isNewUser = true;
    }

    const appJWT = generateAuthToken(user);

    if (isNewUser) {
      await welcomeEmail({ to: user.email });
      return res.status(201).json({
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
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during login.',
    });
  }
};

export { loginUser, loginUserFromGoogle };
