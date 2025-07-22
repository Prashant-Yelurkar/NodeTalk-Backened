import express, { json } from 'express';
import dotenv from 'dotenv';
import CORS from 'cors';
import connectDB from './db/connect.js';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // your frontend origin
    methods: ['GET', 'POST'],
  },
});



app.use(CORS({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware
app.use(express.json());



import authRoute from './auth/authRoute.js';
import useRoute from './routes/userRoute.js'
import authenticateToken from './auth/authMiddleware.js';
import chatRoute from './routes/chatRoute.js'
import { validateToken } from './auth/authController.js';
import User from './model/userModel.js';
app.use('/auth', authRoute);
app.use('/user', authenticateToken  ,useRoute )
app.use('/chat',authenticateToken, chatRoute)

app.get('/', (req, res) => {

  res.json({ message: 'Welcome to the NodeTalk backend!' , status:200, appName: process.env.APP_NAME || 'NodeTalk' , time: new Date().toISOString() });
});



io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  try {
    const decodedUser = validateToken(token);
    const user = await User.findOne({ email: decodedUser.email });
    if (!user) return;

    user.isOnline = true;
    await user.save();

    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('message', (data) => {
      console.log('📩 Message received:', data);
      socket.broadcast.emit('message', data);
    });

    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      user.isOnline = false;
      user.lastActive = new Date()
      await user.save();
    });

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

