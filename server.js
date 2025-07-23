import express, { json } from 'express';
import dotenv from 'dotenv';
import CORS from 'cors';
import connectDB from './db/connect.js';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
dotenv.config();

import authRoute from './auth/authRoute.js';
import useRoute from './routes/userRoute.js'
import authenticateToken from './auth/authMiddleware.js';
import chatRoute from './routes/chatRoute.js'
import { validateToken } from './auth/authController.js';
import User from './model/userModel.js';
import chatModel from './model/chatModel.js';
import uploadRoute from './routes/uploadRoute.js'
import { connectionFn, disconnectSocketFn, sendMessageFn } from './controllers/socketController.js';



const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin:  process.env.NODE_ENV === "development"
    ? process.env.APP_DEVELOPMENT_LINK
    : process.env.APP_PRODUCTION_LINK, 
    methods: ['GET', 'POST'],
  },
});



app.use(CORS())


// Middleware
app.use(express.json());
app.use('/auth', authRoute);
app.use('/user', authenticateToken  ,useRoute )
app.use('/chat',authenticateToken, chatRoute)
app.use('/upload', uploadRoute)
app.get('/', (req, res) => {

  res.json({ message: 'Welcome to the NodeTalk backend!' , status:200, appName: process.env.APP_NAME || 'NodeTalk' , time: new Date().toISOString() });
});


const ActiveUser =new  Map();
io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  try {
    const decodedUser = validateToken(token);
    const user = await User.findOne({ email: decodedUser.email });
    if (!user) return;

    ActiveUser.set(decodedUser.id.toString() , socket.id )
    const chats = await chatModel.find({ members: user._id }).select('members');

    connectionFn(io ,socket, chats, decodedUser,user , ActiveUser)
    socket.on('sendMessage', data => sendMessageFn(socket, io, ActiveUser, data));
    socket.on('disconnect', disconnectSocketFn(socket , io, ActiveUser, user, chats));


  } catch (error) {
    console.error('Socket auth error:', error.message);
    socket.disconnect(); 
  }
});


const connection = async()=>{
    try{
        connectDB(process.env.MONGODB)
        .then(() => {
           server.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}`);
            });
        })
        .catch((error) => console.log(error));
    }
    catch(error){
            console.error("MongoDB Connection Error:", error);
    }; 
}

connection()

