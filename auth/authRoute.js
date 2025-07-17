import express, { json } from 'express';
import authenticate from './authMiddleware.js';

import loginRoute from '../routes/loginRoute.js';
import registerRoute from '../routes/registerRoute.js';
import resetRoute from '../routes/resetRoute.js';
import verrificationRoute from '../routes/verificationRoute.js';
const router = express.Router();



router.use('/login',loginRoute)
router.use('/register',registerRoute)
router.use('/verify',verrificationRoute );
router.use('/reset',resetRoute);


export default router;