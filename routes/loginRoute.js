import express from 'express';
import { loginUser , loginUserFromGoogle } from '../controllers/loginController.js';
const router = express.Router();

router.post('/', loginUser);
router.post('/google', loginUserFromGoogle);
export default router;
