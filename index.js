import express  from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import CORS from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
import connectDB from './db/connect.js';
dotenv.config();



const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin:  process.env.NODE_ENV === "development"
    ? process.env.APP_DEVELOPMENT_LINK
    : process.env.APP_PRODUCTION_LINK, 
    methods: ['GET', 'POST'],
  },
});



app.use(CORS({
  origin:  process.env.NODE_ENV === "development"
    ? process.env.APP_PRODUCTION_LINK
    : process.env.APP_PRODUCTION_LINK,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NodeTalk backend!' , status:200, appName: process.env.APP_NAME || 'NodeTalk' , time: new Date().toISOString() });
});

import authRoute from './auth/authRoute.js';
import useRoute from './routes/userRoute.js'
import authenticateToken from './auth/authMiddleware.js';
import chatRoute from './routes/chatRoute.js'
import { validateToken } from './auth/authController.js';
import User from './model/userModel.js';
import MessageModal from './model/messsageModel.js';
import chatModel from './model/chatModel.js';
app.use('/auth', authRoute);
app.use('/user', authenticateToken  ,useRoute )
app.use('/chat',authenticateToken, chatRoute)


const connection = async()=>{
    try{
        connectDB(process.env.MONGODB)
        .then(() => {
           server.listen(PORT, () => {
                console.log(`Server is running at http://localhost:${PORT}`);
            });
        })
        .catch((error) => console.log(error));
    }
    catch(error){
            console.error("MongoDB Connection Error:", error);
    }; 
}

connection()
