import express from 'express'
import { sendMessage } from '../controllers/chatController.js'
const route = express.Router()

route.post('/send' , sendMessage)

export default route;