import express from 'express';
import {registerUser , registerUserFromGoogle}  from '../controllers/RegisterController.js';


const router = express.Router();

router.post('/', registerUser);
router.post('/google', registerUserFromGoogle)
export default router;
