import express from 'express'
import { getMyChats, getChatMessage } from '../controllers/chatController.js'
const route = express.Router()

route.post('/mychats' , getMyChats)
route.get('/get/:chat_id', getChatMessage)

export default route;