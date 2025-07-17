import express from 'express';
import { emailVerification } from '../controllers/vetificationController.js';
const router = express.Router();

router.post('/email', emailVerification)

export default router;