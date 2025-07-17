import express from 'express'
import { getAllUsers, getMyConnections, getUserById } from '../controllers/userController.js';
const router = express.Router();
router.post('/' , getAllUsers)
router.post('/my_connection' , getMyConnections)
router.get('/:id',getUserById)

export default router;

