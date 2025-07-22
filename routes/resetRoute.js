import express from 'express';
import { validateToken } from '../auth/authController.js';
import User from '../model/userModel.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password)
    return res.status(400).json({ success: false, message: 'Token and password are required.' });

  const userData = validateToken(token);

  if (!userData) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
  }

  const user = await User.findOne({ email: userData.email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  if(userData.tokenVersion != user.tokenVersion)
  {
    return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

  }

  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
  user.password = hashedPassword;
  user.tokenVersion +=1

  await user.save();

  return res.status(200).json({ success: true, message: '✅ Password reset successfully.' });
});

export default router;
